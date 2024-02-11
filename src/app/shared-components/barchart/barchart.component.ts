import { ChangeDetectorRef, Component, SimpleChanges , ElementRef, Input, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarchartComponent implements OnInit {
  infoReady = false;
  colorBars = "#9A6DAC"
  listTransaction = [];
  dataReason: any = [];
  @Input() arrayData: any[] = [];
  @Input() key: string = "";
  @Input() numericKey;  // Input for get numeric chart.
  @Input() idChart: string = "";
  @Input() title: string = "";
  widthBar;
  heightBar;
  radiusBar;
  svgBar: any;
  marginReason = { top: 60, right: 30, bottom: 90, left: 40 };
  @ViewChild("containerReason") containerReason: ElementRef  | undefined;

  constructor(
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.initBarSvg();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listTransaction = changes["arrayData"].currentValue;
    this.dataReason = [];
    this.draw();
  }

  onResize(event): void {
    this.dataReason = [];
    this.widthBar = this.containerReason?.nativeElement.offsetWidth - this.marginReason.right - this.marginReason.left;
    this.heightBar = this.containerReason?.nativeElement.offsetHeight - this.marginReason.top - this.marginReason.bottom;

    const charSVG = d3.select(`#${this.idChart}-svg`)
      .attr("width", this.widthBar + this.marginReason.left + this.marginReason.right)
      .attr("height", this.heightBar + this.marginReason.top + this.marginReason.bottom);

    this.draw();
  }


  draw(): void {
    this.infoReady = false;
    if (this.svgBar){
      this.svgBar.selectAll("*").remove();
    }
    if (typeof this.numericKey === "undefined"){
      this.listTransaction.forEach((item: any) => {
        const itemReason = item[this.key];
        if (this.dataReason[itemReason] == null) {
          this.dataReason[itemReason] = 1;
        } else {
          this.dataReason[itemReason] = this.dataReason[itemReason] + 1;
        }
      });
    }
    else{
      this.listTransaction.forEach((item) => {
        const itemReason = item[this.key];
        if (this.dataReason[itemReason] == null) {
          this.dataReason[itemReason] = item[this.numericKey];
        } else {
          this.dataReason[itemReason] = this.dataReason[itemReason] + item[this.numericKey];
        }
      });
    }

    this.drawCharReason();
    this.infoReady = true;
  }

  initBarSvg(): void {
    this.widthBar = this.containerReason?.nativeElement.offsetWidth - this.marginReason.right - this.marginReason.left;
    this.heightBar = this.containerReason?.nativeElement.offsetHeight - this.marginReason.top - this.marginReason.bottom;
    // append the svg object to the body of the page
    this.svgBar = d3.select(`#${this.idChart}`)
      .append("svg")
      .attr("width", this.widthBar + this.marginReason.left + this.marginReason.right)
      .attr("height", this.heightBar + this.marginReason.top + this.marginReason.bottom)
      .attr("id", `${this.idChart}-svg`)
      .append("g")
      .attr("transform",
        "translate(" + this.marginReason.left + "," + this.marginReason.top + ")");
  }

  drawCharReason(): void {
    const data: any = [];
    let maxValue = 0;
    for (const k in this.dataReason) {
      if (this.dataReason.hasOwnProperty(k)) {
        const item = {
          reason: k,
          value: this.dataReason[k]
        };
        if (k !== "INDETERMINATE") {
          maxValue = (this.dataReason[k] > maxValue ? this.dataReason[k] : maxValue);
          data.push(item);
        }
      }
    }

    // console.log(data);

    // X axis
    const x = d3Scale.scaleBand()
      .range([0, this.widthBar])
      .domain(data.map((d) => d.reason))
      .padding(0.2);
    if (this.svgBar){
      this.svgBar.append("g")
      .attr("transform", "translate(0," + this.heightBar + ")")
      .call(d3Axis.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
      const y = d3Scale.scaleLinear()
        .domain([0, maxValue + 1])
        .range([this.heightBar, 0]);

      this.svgBar.append("g")
        .call(d3Axis.axisLeft(y))
        .call(g => g.select(".domain")
        .remove())
        .call(d3Axis.axisRight(y)
        .tickSize(this.widthBar)
        .tickFormat(formatTick))
        .call(g => g.select(".domain")
        .remove())
        .call(g => g.selectAll(".tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "2,2"))
        .call(g => g.selectAll(".tick text")
          .attr("x", -4)
          .attr("dy", 0));

      function formatTick(this: any, d) {
        if (d < 1e5) {
          return d;
        }
        else{
          const s = (d / 1e6).toFixed(1);
          return (this.parentNode.nextSibling ? `\xa0${s}` : `${s} M`).replace(".", ",");
        }
      }

      const colorBars = this.colorBars

        // Bars
      this.svgBar.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.reason))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => this.heightBar - y(d.value))
        .attr("fill", colorBars);

      // console.log(data);

      this.svgBar.selectAll("mybar")
        .data(data)
        .enter()
        .append("text")
        .text((d) => (d.value))
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("font-family", "Poppins")
        .attr("x", (d) => x.bandwidth() / 2.5 + x(d.reason))
        .attr("y", (d) => -3 + y(d.value))
        .attr("fill", "black");
    }
  }

}
