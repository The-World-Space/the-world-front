import {
    CoroutineIterator,
    WaitForSeconds,
    Component,
    ComponentConstructor,
    GameObject,
    PrefabRef,
    CssSpriteRenderer,
    CssTextRenderer
} from "the-world-engine";
import { CameraPrefab } from "../../prefab/CameraPrefab";
import { TestExectuer } from "./TestExecuter";

//유니티의 컴포넌트 시스템은 게임오브젝트에 추가되는 특성입니다.
//게임오브젝트는 여러개의 컴포넌트를 지닐수 있게됨으로서 컴포넌트를 이용한 다중상속의 효과를 얻을수 있습니다.
//기본적으로 엔진의 모든 기능은 컴포넌트의 메세지함수에서 실행시킴으로서 사용이 가능합니다.
export class KoreanComponentExample extends Component {

    //_disallowMultipleComponent 옵션은 하나의 게임오브젝트에 여러개의 동일한 컴포넌트를 추가할 수 없게 해주는 옵션입니다.
    //만약 이 옵션이 켜진경우 동일한 컴포넌트를 두번 추가하면 자동으로 삭제되며 경고메세지가 출력됩니다.
    //https://docs.unity3d.com/ScriptReference/DisallowMultipleComponent.html
    public readonly disallowMultipleComponent: boolean = true;


    //_requiredComponents 옵션은 이 컴포넌트가 사용할 컴포넌트를 설정하는 옵션입니다.
    //이 컴포넌트가 게임오브젝트에 추가되는 시점에 _requiredComponents 안에 있는 컴포넌트들이 존재하지 않는다면 컴포넌트 추가가 안되며 경고가 출력됩니다.
    //즉, _requiredComponents 안에 있는 컴포넌트들은 무조건 게임오브젝트 안에 존재함이 보장됩니다.
    //https://docs.unity3d.com/ScriptReference/RequireComponent.html
    public readonly requiredComponents: ComponentConstructor[] = [TestExectuer];


    //executionOrder 는 스크립트간에 실행순서를 결정합니다. 기본값은 0 이며 작은 값일수록 먼저 실행됩니다.
    //executionOrder 를 설정해주는것은 마치 zindex 같은 개념이여서 "사용하지 않는게 좋습니다".
    //일반적으로 게임 글로벌 코어 역할을 하는 GameManager 같은 객체에서만 executionOrder 를 낮게하여 무엇보다 먼저 실행됨을 보장받습니다.
    //https://docs.unity3d.com/Manual/class-MonoManager.html
    public readonly executionOrder: number = 0;
    

    //awake 함수는 컴포넌트의 라이프사이클에서 가장먼저 실행되는 함수입니다. 이 함수는 컴포넌트의 라이프사이클에서 한번 실행됩니다.
    //constructor 를 사용해서는 안되며 초기화 작업의 경우 awake 에서 이루어져야합니다.
    //
    //유니티에 따르면 다른 컴포넌트와의 레퍼런스 관계를 설정할때 awake 를 사용한다고 합니다. (getComponent)
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.Awake.html
    protected awake(): void {

        //gameObject는 컴포넌트가 붙어있는 게임오브젝트입니다.
        //컴포넌트는 한번 생성되면 파괴될때까지 다른 게임오브젝트로 이동할 수 없습니다. 그러므로 this.gameObject 값은 항상 동일합니다.
        const gameObject = this.gameObject;
        gameObject.activeSelf;

        //getcomponent 메서드를 사용하여 컴포넌트가 붙어있는 게임오브젝트에서 원하는 타입의 컴포넌트를 가져올 수 있습니다.
        //만약 컴포넌트가 존재하지 않는다면 null을 반환합니다.
        //https://docs.unity3d.com/ScriptReference/GameObject.GetComponent.html
        const cssTextRenderer = this.gameObject.getComponent(CssTextRenderer);
        cssTextRenderer?.enabled;

        //_requiredComponents 에서 TestExectuer 가 존재하기에 getComponent(TestExectuer) 는 절대로 실패할 수가 없습니다.
        //따라서 여기에는 null forgiving 을 사용할수 있습니다.
        const testExecuter: TestExectuer = this.gameObject.getComponent(TestExectuer)!;
        testExecuter.enabled;

        //addComponent 는 게임오브젝트에 컴포넌트를 추가합니다.
        //_disallowMultipleComponent나 _requiredComponents 옵션에 의해 추가에 실패할 수 있기 떄문에 null 을 반환할수도 있습니다.
        //https://docs.unity3d.com/ScriptReference/GameObject.AddComponent.html
        const cssSpriteRenderer = this.gameObject.addComponent(CssSpriteRenderer);

        //destroy는 게임오브젝트에서 컴포넌트를 제거합니다.
        if(cssSpriteRenderer) cssSpriteRenderer.destroy();

        //델타타임을 가져옵니다.
        const deltaTime = this.engine.time.deltaTime;
        deltaTime.toString();

        //test_game_object 라는 이름의 게임오브젝트를 차일드로 생성합니다.
        this.gameObject.addChildFromBuilder(this.engine.instantiater.buildGameObject("test_game_object"));

        //컴포넌트가 존재하는 게임오브젝트를 추가하는 예시입니다.
        this.gameObject.addChildFromBuilder(this.engine.instantiater.buildGameObject("test_game_object2")
            .withComponent(CssTextRenderer, c => {
                //이 람다식은 initialize 스테이지에서 호출되는데, initialize -> awake -> onEnable -> start -> update 순으로 호출됩니다.
                //initialize 스테이지에서는 컴포넌트가 초기화되어있지 않습니다.
                //그러므로 initialize 스테이지에서는 사이드이펙트가 존재하지 않는 컴포넌트의 함수만 실행해야하고,
                //만약 사이드이펙트가 존재하더라도 그 함수가 lazy evaluation 을 구현한다면 함수를 실행하는것이 가능하나 함수 호출의 순서가 보장되지 않습니다.
                //lazy eavluation의 구현 예시는 render/CssTilemapRenderer의 94번째 줄에서 알아볼 수 있습니다.
                c.text = "Hello World";
            }));

        //camera 라는 이름의 prefab을 차일드로 생성합니다.
        //https://docs.unity3d.com/Manual/Prefabs.html
        this.gameObject.addChildFromBuilder(this.engine.instantiater.buildPrefab("camera", CameraPrefab).make());

        
        //test_game_object 라는 이름의 게임오브젝트를 차일드로 생성한뒤 생성된 오브젝트를 가져옵니다.
        //call by ref를 사용합니다.
        const prefabRef = new PrefabRef<GameObject>();
        this.gameObject.addChildFromBuilder(this.engine.instantiater.buildGameObject("test_game_object").getGameObject(prefabRef));
        const gameObject2 = prefabRef.ref!; //이 시점에선 null forgiving 을 사용할수 있습니다. (생성이 무조건 보장됨)
        gameObject2.activeSelf;
    }

    //start 함수는 awake 이후에 실행되는 함수입니다. 이 함수는 컴포넌트의 라이프사이클에서 한번 실행됩니다.
    //start 함수는 executionOrder에 의해 실행순서를 지정이 가능하므로 다른 컴포넌트와 메세징을할때 이 함수를 사용합니다. (서로 초기화 순서에 유의해서 메세징을 해야하는 케이스가 존재함)
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
    protected start(): void {
        console.log("start");

        //코루틴을 실행합니다.
        const coroutine = this.startCorutine(this.someCoroutine());

        //코루틴을 중지합니다. (이 컴포넌트가 실행한 코루틴만 중지할 수 있습니다.)
        this.stopCoroutine(coroutine);

        //모든 코루틴을 중지합니다. (이 컴포넌트가 실행한 코루틴만 해당됩니다.)
        this.stopAllCoroutines();

        //this.gameObject의 activeInHierarchy가 false 가 되는 시점에 (게임오브젝트가 비활성화 되는 시점에) 이 컴포넌트에서 실행한 모든 코루틴은 중지됩니다.
    }

    private *someCoroutine(): CoroutineIterator {
        for (let i = 0; i < 10; i++) {
            console.log(i);
            //yield 에서 컨텍스트를 엔진에게 전달하고 1초후에 다시 컨텍스트를 엔진으로부터 받습니다.
            //결과적으로 yield new WaitForSeconds(1); 은 1초동안 이 루틴을 멈춘다 정도의 의미가 됩니다.
            //WaitForSeconds 는 프레임 단위로 측정되기 때문에 정확하지 않습니다. (미세한 오차가 있음)
            //여러번의 WaitForSeconds로 정밀한 시간 측정 작업이 요구되는경우에는 코루틴을 쓰는것보다 update 함수에서 직접 로직을 통하여 측정하는것이 더 정확합니다.
            yield new WaitForSeconds(1);
        }
    }

    //update 함수는 매 프레임마다 실행되는 함수입니다. 자원을 많이 먹는 요소중 하나이므로 update 를 사용할때는 적절히 사용해야합니다.
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.Update.html
    public update(): void {
        console.log("update");
    }

    //onEnable 함수는 컴포넌트가 활성화되는 시점에 실행됩니다.
    //컴포넌트의 활성화 값은 this.enabled 을 의미합니다.
    //컴포넌트가 게임오브젝트에 추가되는 시점에도 컴포넌트가 활성화되어있는경우 실행됩니다.
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnEnable.html
    public onEnable(): void {
        console.log("onEnable");
    }

    //onDisable 함수는 컴포넌트가 비활성화되는 시점에 실행됩니다.
    //컴포넌트의 활성화 값은 this.enabled 을 의미합니다.
    //컴포넌트가 파괴되는 시점에도 실행됩니다.
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnDisable.html
    public onDisable(): void {
        console.log("onDisable");
    }

    //onDestroy 함수는 컴포넌트가 제거될때 실행되는 함수입니다.
    //컴포넌트에서 사용하는 자원을 정리하는 동작을 할때 사용합니다.
    //https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnDestroy.html
    public onDestroy(): void {
        console.log("onDestroy");
    }
}
