function generateDummyTrans () {
    var trans =
      Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    trans.addDataFlavor("text/unicode");
    var genTextData =
      Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
     genTextData.data = "this is a test";
    trans.setTransferData ( "text/unicode", genTextData, genTextData.data.length);
    var transArray =
      Components.classes["@mozilla.org/supports-array;1"].createInstance(Components.interfaces.nsISupportsArray);
    var genTrans = trans.QueryInterface(Components.interfaces.nsISupports);
    transArray.AppendElement(genTrans);
    return transArray;
}
  

var myDragAndDrop = {
  
  _mDS: null,
  get mDragService()
    {
      if (!this._mDS) 
        {
          const kDSContractID = "@mozilla.org/widget/dragservice;1";
          const kDSIID = Components.interfaces.nsIDragService;
          this._mDS = Components.classes[kDSContractID].getService(kDSIID);
        }
      return this._mDS;
    },

  /**
   * void startDrag (DOMEvent aEvent, Object aDragDropObserver) ;
   *
   * called when a drag on an element is started.
   *
   * @param DOMEvent aEvent
   *        the DOM event fired by the drag init
   * @param Object aDragDropObserver
   *        javascript object of format described above that specifies
   *        the way in which the element responds to drag events.
   **/  
  startDrag: function (aEvent, aDragDropObserver)
    {

      var transArray = generateDummyTrans();
      try {
        this.mDragService.invokeDragSession(aEvent.target, transArray, null,  nsIDragService.DRAGDROP_ACTION_COPY + nsIDragService.DRAGDROP_ACTION_MOVE );
      }
      catch(ex) {}
      aDragDropObserver.onDragStart(aEvent, this.mDragSession);
      //aEvent.stopPropagation()
    },

  /** 
   * void dragOver (DOMEvent aEvent, Object aDragDropObserver) ;
   *
   * called when a drag passes over this element
   *
   * @param DOMEvent aEvent
   *        the DOM event fired by passing over the element
   * @param Object aDragDropObserver
   *        javascript object of format described above that specifies
   *        the way in which the element responds to drag events.
   **/
  dragOver: function (aEvent, aDragDropObserver)
    { 
      //if (!this.checkCanDrop(aEvent, aDragDropObserver))
      //  return;
      aDragDropObserver.onDragOver(aEvent, this.mDragSession);
      aEvent.stopPropagation()
    },

  mDragSession: null,

  /** 
   * void drop (DOMEvent aEvent, Object aDragDropObserver) ;
   *
   * called when the user drops on the element
   *
   * @param DOMEvent aEvent
   *        the DOM event fired by the drop
   * @param Object aDragDropObserver
   *        javascript object of format described above that specifies
   *        the way in which the element responds to drag events.
   **/
  drop: function (aEvent, aDragDropObserver)
    {
      if (!("onDrop" in aDragDropObserver))
        return;
      if (!this.checkCanDrop(aEvent, aDragDropObserver))
        return;  
      if (this.mDragSession.canDrop) {
        aDragDropObserver.onDrop(aEvent, this.mDragSession);
      }
      aEvent.stopPropagation()
    },

  /** 
   * void dragExit (DOMEvent aEvent, Object aDragDropObserver) ;
   *
   * called when a drag leaves this element
   *
   * @param DOMEvent aEvent
   *        the DOM event fired by leaving the element
   * @param Object aDragDropObserver
   *        javascript object of format described above that specifies
   *        the way in which the element responds to drag events.
   **/
  dragExit: function (aEvent, aDragDropObserver)
    {
      if (!this.checkCanDrop(aEvent, aDragDropObserver))
        return;
      if ("onDragExit" in aDragDropObserver)
        aDragDropObserver.onDragExit(aEvent, this.mDragSession);
    },  
    
  /** 
   * void dragEnter (DOMEvent aEvent, Object aDragDropObserver) ;
   *
   * called when a drag enters in this element
   *
   * @param DOMEvent aEvent
   *        the DOM event fired by entering in the element
   * @param Object aDragDropObserver
   *        javascript object of format described above that specifies
   *        the way in which the element responds to drag events.
   **/
  dragEnter: function (aEvent, aDragDropObserver)
    {
      if (!this.checkCanDrop(aEvent, aDragDropObserver))
        return;
      if ("onDragEnter" in aDragDropObserver)
        aDragDropObserver.onDragEnter(aEvent, this.mDragSession);
    },  
    
  /** 
   * Boolean checkCanDrop (DOMEvent aEvent, Object aDragDropObserver) ;
   *
   * Sets the canDrop attribute for the drag session.
   * returns false if there is no current drag session.
   *
   * @param DOMEvent aEvent
   *        the DOM event fired by the drop
   * @param Object aDragDropObserver
   *        javascript object of format described above that specifies
   *        the way in which the element responds to drag events.
   **/
  checkCanDrop: function (aEvent, aDragDropObserver)
    {
      if (!this.mDragSession) 
        this.mDragSession = this.mDragService.getCurrentSession();
      if (!this.mDragSession) 
        return false;
      this.mDragSession.canDrop = this.mDragSession.sourceNode != aEvent.target;
      if ("canDrop" in aDragDropObserver)
        this.mDragSession.canDrop &= aDragDropObserver.canDrop(aEvent, this.mDragSession);
      return true;
    } 
};

