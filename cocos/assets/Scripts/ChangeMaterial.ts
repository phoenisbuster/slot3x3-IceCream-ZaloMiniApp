import { _decorator, Component, Material, MeshRenderer, Node, RenderTexture, SpriteFrame, SpriteRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChangeMaterial')
export class ChangeMaterial extends Component {

    @property({type: Material})
    public material: Material [] = []

    @property({type: Number})
    public userNumber;

    private meshRenderer: MeshRenderer = null;

    start() {
        this.meshRenderer = this.node.getComponent(MeshRenderer);
        // this.setUserNumber(this.userNumber);
    }

    setUserNumber(num: number){
        this.meshRenderer.setMaterial(this.material[Math.floor(num/10)],1);
        this.meshRenderer.setMaterial(this.material[num%10],0);
    }
}

