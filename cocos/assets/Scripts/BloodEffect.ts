import { _decorator, Component, director, instantiate, Node, ParticleAsset, ParticleSystem, ParticleSystemComponent, Prefab, SceneAsset } from 'cc';
import { MovingCharacter } from './MovingCharacter';
const { ccclass, property } = _decorator;

@ccclass('BloodEffect')
export class BloodEffect extends Component {
    @property(Prefab)
    bloodEffect: Prefab = null;

    start() {
        const blood = instantiate(this.bloodEffect)
        blood.parent = this.node.parent; // this scene
        blood.setPosition(this.node.position);
        blood.active = true;
        blood.setRotationFromEuler(0,MovingCharacter.rotateBloodEffect,0);
    }
}

