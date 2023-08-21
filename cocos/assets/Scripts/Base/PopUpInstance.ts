// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Widget, director, Tween, tween, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class PopUpInstance extends Component {
    @property(Widget)
    background: Widget = null;
    @property(Node)
    panelNode: Node = null;

    @property(UIOpacity)
    panelOpacity: UIOpacity = null;
    @property
    normalPanelSize: number = 1;
    @property
    scaleWhenOpenAndClosePanelSize: number = 1.05;

    _open = false;
    _data;
  
    _onYes: () => void;
    _onNo: () => void;
    _close: () => void;
  
    onDestroy() {
      this.unscheduleAllCallbacks();
    }
  
    onLoad() {
      if (!this.background) this.background = this.node.getChildByName("darkBackground")?.getComponent(Widget);
      if (this.background) {
        this.background.isAlignLeft = true;
        this.background.isAbsoluteRight = true;
        this.background.isAbsoluteTop = true;
        this.background.isAlignBottom = true;
        this.background.left = -500;
        this.background.top = -500;
        this.background.bottom = -500;
        this.background.right = -500;
        this.background.target = director.getScene().getChildByName("Canvas");
      }
      this.node.active = false;
    }
    
    showPopup() {
      if (this.panelNode != null) {
        this.panelNode.scale = Vec3.ZERO;
        this.panelOpacity.opacity = 0;
        this.node.active = true;
        Tween.stopAllByTarget(this.panelNode);

        let scale1 = this.normalPanelSize * this.scaleWhenOpenAndClosePanelSize;
        let scale2 = this.normalPanelSize;
        tween(this.panelNode)
          .to(0, { scale: Vec3.ZERO})
          .to(0.2, { scale: new Vec3(scale1, scale1, scale1)})
          .to(0.1, { scale: new Vec3(scale2, scale2, scale2)})
          .call(() => { this.showDone();})
          .start();

        tween(this.panelOpacity)
          .to(0, { opacity: 0 })
          .to(0.2, { opacity: 255 })
          .start();
      } else {
        this.node.active = true;
        this.showDone();
      }
    }

    hidePopup() {
      if (this.panelNode != null) {
        Tween.stopAllByTarget(this.panelNode);
        let scale = this.normalPanelSize * this.scaleWhenOpenAndClosePanelSize;
        tween(this.panelNode)
          .to(0.2, { scale: new Vec3(scale, scale, scale)})
          .call(() => {
            this.node.active = false;
            this.closeDone();
          }).start();

        tween(this.panelOpacity)
          .to(0.2, { opacity: 0 })
          .start();
      } else {
        this.closeDone();
      }
    }
  
    public open(data, onYes: () => void = null, onNo: () => void = null) {
      this.beforeShow();
      this._open = true;
      this.showPopup();
      this._data = data;
      this._onYes = onYes;
      this._onNo = onNo;
      this.onShow(data);
    }
  
    public closeInstance() {
      if (!this._open) return;
      this._open = false;
      if (this._close) this._close();
      this.beforeClose();
      this.hidePopup();
  
    }
  
    protected close() {
      this._open = false;
      if (this._close) this._close();
      this.beforeClose();
      this.hidePopup();
    }
  
    public onYes() {
      if (this._onYes) {
        this._onYes();
      }
      this.close();
    }
  
    public onNo() {
      if (this._onNo) {
        this._onNo();
      }
      this.close();
    }
  
    //#region Call From Animation Event
    public showDone() {
      this.afterShow();
    }
  
    public closeDone() {
      if (this._open == false) {
        this.node.active = false;
        this.afterClose();
      }
    }
  
    //#endregion
  
    protected onShow(data) { }
  
    protected afterShow() { }
  
    protected beforeShow() { }
  
    protected beforeClose() { }
  
    protected afterClose() { }
}
