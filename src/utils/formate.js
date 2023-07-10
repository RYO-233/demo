export function formateDate(dateStr,type="yyyy-MM-dd hh:mm:ss"){
  console.log(type);
  if(!dateStr) return
  let timpStap=new Date(dateStr);
  let year=timpStap.getFullYear();
  let month=timpStap.getMonth()<9?'0'+(timpStap.getMonth()+1):timpStap.getMonth()+1;
  let day=timpStap.getDate()<10?'0'+timpStap.getDate():timpStap.getDate();
  let hour=timpStap.getHours()<10?'0'+timpStap.getHours():timpStap.getHours();
  let minute=timpStap.getMinutes()<10?'0'+timpStap.getMinutes():timpStap.getMinutes();
  let seconds=timpStap.getSeconds()<10?'0'+timpStap.getSeconds():timpStap.getSeconds();
  if(type=="yyyy-MM-dd hh:mm:ss"){
    return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+seconds
  }
  if(type=="yyyy-MM-dd"){
    return year+"-"+month+"-"+day;
  }
  if(type=="hh:mm:ss"){
    return hour+":"+minute+":"+seconds
  }
}