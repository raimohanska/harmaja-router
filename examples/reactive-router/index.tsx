import { componentScope, h, mount } from "harmaja"
import { ReactiveRouter } from "../../src/ReactiveRouter"
import * as L from "lonna" 
import { Link, RouteMap, RouteKey } from "../../src"

const BOARD_ROUTE = "/board/:boardId"
const ROOT_ROUTE = "/"
const routes = {
    [ROOT_ROUTE]: () => <Home/>,
    [BOARD_ROUTE]: ({ boardId }) => <Board boardId={boardId}/>,
    "": () => <div id="not-found">Not found</div>,
}
type Routes = typeof routes

const App = () => {
    const router = ReactiveRouter(
        routes,
        componentScope(),
    )

    // To navigate type-safely to a known route in your application:
    //router.navigateByParams(BOARD_ROUTE, { boardId: "board1" })
    
    // To navigate to an arbitrary path you'll need a cast to any, because
    // even the navigateByPath is type safe.
    
    //router.navigateByPath("/some/path" as any)

    return <html>
        { router.result }        
    </html>
}

const Home = () => {
    return <div id="root">
        <h1>Welcome</h1>
        <ul>
            <li><Link<Routes> href="/board/board1">Board 1</Link></li>
        </ul>
    </div>
}

const Board = ({ boardId }: { boardId: string }) => {
    return <div id="board">
        <h1>{ boardId }</h1>
    </div>
}

mount(<App/>, document.getElementById("root")!)