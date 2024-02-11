import { Component, ElementRef, Input, SimpleChanges, ViewChild } from "@angular/core";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Shape from "d3-shape";
import * as d3Event from "d3-selection";
import * as d3T from "d3-time";
import * as d3Time from "d3-time-format";
import * as d3format from "d3-format";

@Component({
  selector: "app-linechart",
  templateUrl: "./linechart.component.html",
  styleUrls: ["./linechart.component.sass"]
})
export class LinechartComponent {

  @Input() arrayData: any[] | undefined;
  @Input() idChart: string | undefined;
  @Input() title: string  | undefined;
  colorLine = "#9A6DAC"
  colorPopup = "#9A6DAC"
  @ViewChild("containerTransactions") container: ElementRef | undefined;
  dataChange: any[] = [];
  data: any = [];
  chartMode = "individual";
  infoReady = true;
  range = "day";
  width: number | undefined;
  height: number | undefined;
  margin = { top: 70, right: 30, bottom: 30, left: 50 };
  x: any;
  y: any;
  line: any;
  xAxis: any;
  yAxis: any;
  svg: any;

  constructor() { }

  ngAfterViewInit(){
    this.initSvg();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataChange = [...changes["arrayData"].currentValue];
    this.data = [];
    this.draw();
  }

  onResize(event): void {
    this.data = [];
    this.width = this.container?.nativeElement.offsetWidth - this.margin.right - this.margin.left;
    this.height = this.container?.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    const charSVG = d3.select(`#${this.idChart}-svg`)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.draw();
  }

  changeMode(event){
    this.chartMode = event.value;
    this.data = [];
    this.draw();
  }

  changeRange(event){
    this.range = event.value;
    this.data = [];
    this.draw();
  }


  initSvg(): void {
    this.width = this.container?.nativeElement.offsetWidth - this.margin.right - this.margin.left;
    this.height = this.container?.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(`#${this.idChart}`)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("id", `#${this.idChart}-svg`)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  draw(): void {
    this.infoReady = false;
    if (this.svg){
      this.svg.selectAll("*").remove();
    }
    if (this.dataChange.length !== 0){
      this.data = this.dataChange;

      const startDate = this.data[0].date;
      const endDateMili = this.data[this.data.length - 1].date.getTime() + 24 * 60 * 60 * 1000;
      const endDate = new Date(endDateMili);
      const dateRange = d3T.timeDay.range(startDate, endDate);
      this.data = dateRange.map((bucket) => {
        return this.data
          .find(({date}) => date.toISOString().split("T")[0] === bucket.toISOString().split("T")[0]) || {date: bucket, value: 0};
      });

      if (this.range === "month"){
        let dataAux = this.data;
        const months:any = [];

        while (dataAux.length !== 0){
          const {date: dateAux} = dataAux[0];
          const condition = `${dateAux.getMonth()}${dateAux.getFullYear()}`;
          months.push(dataAux.filter(({date}) => `${date.getMonth()}${date.getFullYear()}` === condition));
          dataAux = dataAux.filter(({date}) => `${date.getMonth()}${date.getFullYear()}` !== condition);
        }

        this.data = months.map(mes => {
          return mes.reduce((prevItem, item) => {
            return {
              date: new Date(prevItem.date.getFullYear(), prevItem.date.getMonth(), 1),
              value: prevItem.value + item.value
            };
          });
        });
      }
      else if (this.range === "week"){
        let dataAux = this.data.map((item) => {
          return {
            ...item,
            week: this.getWeekOfDay(item.date)
          };
        });

        const weeks:any = [];

        while (dataAux.length !== 0){
          const {week: weekAux, date: dateAux} = dataAux[0];
          const condition = `${weekAux}${dateAux.getFullYear()}`;
          weeks.push(dataAux.filter(({week, date}) => `${week}${date.getFullYear()}` === condition));
          dataAux = dataAux.filter(({week, date}) => `${week}${date.getFullYear()}` !== condition);
        }
        const weeksAux = d3T.timeSunday.range(this.data[0].date, this.data[this.data.length - 1].date);

        this.data = weeks.map(mes => {
          return mes.reduce((prevItem, item) => {
            return {
              date: weeksAux.find(week => `${this.getWeekOfDay(week)}${week.getFullYear()}` === `${this.getWeekOfDay(item.date)}${item.date.getFullYear()}`) || item.date,
              value: prevItem.value + item.value,
              week: prevItem.week
            };
          });
        });
      }

      if (this.chartMode === "acumulado"){
        const dataAux:any = [];
        let index = 0;
        for (const item of this.data){
          if (index === 0){
            dataAux.push({value: item.value, date: item.date});
          }else{
            dataAux.push({value: item.value + dataAux[index - 1].value, date: item.date});
          }
          index++;
        }

        this.data = dataAux;
      }
      this.drawChart();
    }

    this.infoReady = true;
  }

  drawChart(): void{
    const bisectDate = d3Array.bisector((d: any) => d.date).left;
    const formatValue = d3format.format(",.2f");
    const formatMonth = d3Time.timeFormat("%b-%Y");
    const fomartWeek = d3Time.timeFormat("%V-%Y");
    const colorLine = this.colorLine
    const colorPopup = this.colorPopup
    const formatCurrency = (d) => "$" + formatValue(d);
    const format = (d): any => {
      if (Math.abs(d) < 1e5) {
        return d;
      }
      else{
        const s = (d / 1e6).toFixed(1);
        return `${s} M`.replace(".", ",");
      }
    };
    const formatDate = (date) => {
      if (this.range === "month"){
        return formatMonth(date);
      }else if (this.range === "week"){
        return fomartWeek(date);
      }else{
        return date.toISOString().split("T")[0];
      }
    };

    if (this.svg){
      this.x = d3Scale.scaleTime()
      .domain(<[Date, Date]>d3Array.extent(this.data, (d: any) => d.date))
      .range([0, this.width]);

      this.xAxis = this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")");

      if (this.range === "month"){
        this.xAxis.call(d3Axis.axisBottom(this.x)
        .tickFormat(d3Time.timeFormat("%b")));
      }else if (this.range === "week"){
        this.xAxis.call(d3Axis.axisBottom(this.x)
        .tickFormat(d3Time.timeFormat("%V")));
      }else{
        this.xAxis.call(d3Axis.axisBottom(this.x));
      }

      if(this.data.some(({value}) => value<0)){
        this.y = d3Scale.scaleLinear()
        .domain([d3Array.min(this.data, ({value}) => +(1.1 * value )), d3Array.max(this.data, ({value}) => +(1.1 * value ))])
        .range([this.height, 0]);
      }
      else{
        this.y = d3Scale.scaleLinear()
        .domain([0, d3Array.max(this.data, ({value}) => +(1.1 * value ))])
        .range([this.height, 0]);
      }

      this.yAxis = this.svg.append("g")
        .call(d3Axis.axisLeft(this.y))
        .call(g => g.select(".domain")
        .remove())
        .call(d3Axis.axisRight(this.y)
        .tickSize(this.width)
        .tickFormat(formatTick))
        .call(g => g.select(".domain")
        .remove())
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-dasharray", "2,2"))
        .call(g => g.selectAll(".tick text")
        .attr("x", -4)
        .attr("dy", 0));

      function formatTick(this: any, d): any {
        if (Math.abs(d) < 1e5) {
          return d;
        }
        else{
          const s = (d / 1e6).toFixed(1);
          return (this.parentNode.nextSibling ? `\xa0${s}` : `${s} M`).replace(".", ",");
        }
      }
      // Create the circle that travels along the curve of chart
      const focus = this.svg
        .append("g")
        .append("circle")
        .style("fill", "tomato")
        .attr("stroke", "black")
        .attr("r", 3)
        .style("opacity", 0);

      // Plot chart time
       this.line = this.svg.append("path")
         .datum(this.data)
         .attr("fill", "none")
         .attr("stroke", colorPopup)
         .attr("stroke-width", 1.5)
         .attr("d", d3Shape.line()
           .y((d: any) => this.y(d.value))
           .x((d: any) => this.x(d.date))
         );

      const focusText = this.svg
        .append("svg")
        .style("opacity", 0);

      const rect = focusText
      .append("rect")
      .style("font-size", "15px")
      .style("fill", colorPopup)
      .style("width", "80px")
      .style("height", "40px")
      .attr("rx", 10)
      .attr("ry", 10);

      const text1 = focusText
        .append("text")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "Poppins")
        .attr("x", 5)
        .attr("y", 15)
        .attr("fill", "white");

      const text2 = focusText
      .append("text")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("font-family", "Poppins")
      .attr("x", 5)
      .attr("y", 30)
      .attr("fill", "white");

      // Actions
      this.svg
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("mousemove", (event) => {
          const x0 = this.x.invert(d3Event.pointer(event)[0]);
          const i = bisectDate(this.data, x0, 1);
          const d0 = this.data[i - 1];
          const d1 = this.data[i];
          const selectedData = x0 - d0.date > d1.date - x0 ? d1 : d0;
          if (selectedData.value !== 0){
            focus
            .attr("cx", this.x(selectedData.date))
            .attr("cy", this.y(selectedData.value));

            text1
              .text(formatDate(selectedData.date));

            text2
              .text(`(${format(selectedData.value)})`);

            focusText
              .attr("x", (this.x(selectedData.date) > (this.width || 0) / 2) ? this.x(selectedData.date) - 80 : 10 + this.x(selectedData.date))
              .attr("y", -40 + this.y(selectedData.value));
          }
        })
        .on("mouseover", (event) => {
          focus.style("opacity", 1);
          focusText.style("opacity", 1);
        })
        .on("mouseout", () => {
          focus.style("opacity", 0);
          focusText.style("opacity", 0);
        });
    }
    // Axis
  }


  getWeekOfDay(date: Date): number{
    const oneJan = new Date(date.getFullYear(), 0, 1);

    const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const result = Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);
    return result;
  }

}