
export const caculateOtherHeight=function(cutClassNames=[]) {
    let total = 0;
    if( cutClassNames&& cutClassNames.length>0){
       cutClassNames.forEach((className) => {
        const h =document.getElementsByClassName(className)[0].offsetHeight || 0;
        total = total + h;
      });
    }
   return total;
  }
  //计算减后的实际高度
  export const calculateHeight=function(cutClassNames=[],cutHeight=0) {
    let otherHeight=caculateOtherHeight(cutClassNames);
    const windowHeight = window.innerHeight; // 窗口高度
    const top = document.getElementById("scrollContent").getBoundingClientRect().top;//滚动区域到顶部距离
    const pageContent = document.getElementById("pageContent");
    let bottomPx = window.getComputedStyle(pageContent).paddingBottom||0;
    let bottomPxM=window.getComputedStyle(pageContent).marginBottom||0;
    const bottom = Number(bottomPx.replace("px", "") || 0);
    const bottomM=Number(bottomPxM.replace("px", "") || 0);
    const total = top + bottom+bottomM + otherHeight;
    const height = windowHeight - total-cutHeight;
   
    return  height;
  }
  export const handleWindowOnresize=function(){
    window.onresize = () => {
        return (() => {
        
          calculateHeight();
        })();
      };
  }
