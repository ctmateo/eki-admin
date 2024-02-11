export const stringToSeconds = (time) => {
    // console.log(time);
    const [minute, seconds] = time.split(":")
    const miliseconds = Number(minute)*60 + Number(seconds)
    // console.log(miliseconds);
    return miliseconds
  }
  
  export const getShortDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }
  
  export const secondsToString = (seconds) => {
    // let hour = Math.floor(seconds / 3600);
    // hour = (hour < 10)? '0' + hour : hour;
    let minute: (string | number) = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    let second: (string | number) = Math.floor(seconds % 60);
    second = (second < 10) ? '0' + second : second;
    return minute + ':' + second;
  }