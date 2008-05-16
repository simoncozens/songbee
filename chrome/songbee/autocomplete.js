
function textboxSelect (oTextbox, iStart, iEnd) {

   switch(arguments.length) {
       case 1:
           oTextbox.select();
           break;

       case 2:
           iEnd = oTextbox.value.length;
           /* falls through */
           
       case 3:          
           oTextbox.setSelectionRange(iStart, iEnd);
   }

   oTextbox.focus();
}

function textboxReplaceSelect (oTextbox, sText) {
   var iStart = oTextbox.selectionStart;
   oTextbox.value = oTextbox.value.substring(0, iStart) + sText + oTextbox.value.substring(oTextbox.selectionEnd, oTextbox.value.length);
   oTextbox.setSelectionRange(iStart + sText.length, iStart + sText.length);
   oTextbox.focus();
}

function autocompleteMatch (sText, arrValues) {
  if (sText.length < 1) { return; }
   for (var i=0; i < arrValues.length; i++) {
       if (arrValues[i]["text"].toUpperCase().indexOf(sText.toUpperCase()) == 0) {
           return i;
       }
   }

   return null;

}

function autocomplete(oTextbox, oEvent, oSelect, oDebug) {
   switch (oEvent.keyCode) {
       case 38: //up arrow  
       case 40: //down arrow
       case 37: //left arrow
       case 39: //right arrow
       case 33: //page up  
       case 34: //page down  
       case 36: //home  
       case 35: //end                  
       //case 13: //enter  
       case 32: // space
       case 9: //tab  
       case 27: //esc  
       case 16: //shift  
       case 17: //ctrl  
       case 18: //alt  
       case 20: //caps lock
       case 8: //backspace  
       case 46: //delete
           return true;
           break;

       default:
           var iLen = oTextbox.value.length;
           var iIndex = autocompleteMatch(oTextbox.value, oSelect.options);
           if (iIndex != null) {
               var sMatch = oSelect.options[iIndex]["text"];
               oSelect.selectedIndex = iIndex;
               oTextbox.value = sMatch;
               textboxSelect(oTextbox, iLen, oTextbox.value.length);
           }  
   }
}

