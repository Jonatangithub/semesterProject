
function loadTemplate(aTemplateID, aDestElement, aEmptyElement = false){
  
  const tl = document.getElementById(aTemplateID);
  if(tl.content){
    const clone = tl.content.cloneNode(true);
    if(aEmptyElement){
      emptyContainerElement(aDestElement);
    }
    aDestElement.appendChild(clone);
  }else{
    console("Your browser does not support templates!");
  }
}

function emptyContainerElement(aElement){
  let child = aElement.firstChild;
  while(child){
    aElement.removeChild(child);
    child = aElement.firstChild();
  }
}