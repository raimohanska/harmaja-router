## harmaja-router

A naive little JavaScript/TypeScript request routing library that allows you to define your routes in a typesafe manner - it forces your route handlers match the parameters defined in your routes. Inspired by [typera](https://github.com/akheron/typera) which provides similar typesafe routing on the server side.

The library is written primarily for use with the [Harmaja](https://github.com/raimohanska/harmaja) rendering library but, despite its name, is not actually very dependent on Harmaja.

### HarmajaRouter and Link

In Harmaja applications, you should most likely use the `HarmajaRouter` function to create your router. See full example [here](examples/harmaja-router). You can also run the example app with `yarn example`.

HarmajaRouter binds itself to the the Harmaja [Context](https://github.com/raimohanska/harmaja#context) so that you can now conveniently use the `Link` component anywhere in the
child components of the component that created the router.

You can also navigate programmatically from anywhere using the `getNavigator` method.

```ts
import { h, mount } from "harmaja"
import { Link, HarmajaRouter, getNavigator } from "../../src"

// 1. Define some routes
const BOARD_ROUTE = "/board/:boardId"
const ROOT_ROUTE = "/"
const routes = {
    [ROOT_ROUTE]: () => <Home/>,
    [BOARD_ROUTE]: ({ boardId }) => <Board boardId={boardId}/>,
    "": () => <div id="not-found">Not found</div>,
}
type Routes = typeof routes

const App = () => {
    // 2. Create a router that maps routes to route handlers. The router exposes the 
    //    result of the current route handler as the result value, so you can just 
    //    embed it in your JSX.

    return <html>
        { HarmajaRouter(routes) }        
    </html>
}

const Home = () => {
    // 4. You can now use the Link component to create links that use the router for navigation.
    //    The `href` attribute is type-safe.

    //    You can also use `getNavigator` to get programmatic access to navigation.
    const navigator = getNavigator<Routes>()
    return <div id="root">
        <h1>Welcome</h1>
        <ul>
            <li><Link<Routes> href="/board/board1">Board 1</Link></li>
        </ul>
        <ul>
            <li><a href="/board/board2" onClick={e => {
                navigator.navigateByPath("/board/board2")
                e.preventDefault()
            }}>Board 2</a></li>
        </ul>        
        <ul>
            <li><a href="/board/board3" onClick={e => {
                navigator.navigateByParams(BOARD_ROUTE, { boardId: "board3" })
                e.preventDefault()
            }}>Board 3</a></li>
        </ul>        
    </div>
}

const Board = ({ boardId }: { boardId: string }) => {
    return <div id="board">
        <h1>{ boardId }</h1>
        <p><Link<Routes> href="/">All boards</Link></p>
    </div>
}

mount(<App/>, document.getElementById("root")!)
```

### ReactiveRouter

The library also exposes the `ReactiveRouter` function that returns a router that's not dependent on the Harmaja rendering library. See full example [here](examples/reactive-router).

```ts
const App = () => {
    // 1. Define some routes
    const BOARD_ROUTE = "/board/:boardId"
    const ROOT_ROUTE = "/"

    // 2. Create a router that maps routes to route handlers. When using Harmaja, the handlers
    //    instantiate Harmaja components like this.
    const router = ReactiveRouter(
        {
            [ROOT_ROUTE]: () => <Home />,
            [BOARD_ROUTE]: ({ boardId }) => <Board boardId={boardId} />,
            // The empty string is a catch-all
            "": () => <div id="not-found">Not found</div>,
        },
        L.globalScope
    );

    // To navigate type-safely to a known route in your application:
    router.navigateByParams(BOARD_ROUTE, { boardId: "board1" });

    // To navigate to an arbitrary path you'll need a cast to any, because
    // even the navigateByPath is type safe.

    router.navigateByPath("/some/path" as any);

    // 3. The router exposes the result of the current route handler in its `.result`
    //    field which is a reactive property. In Harmaja, you can just embed it to your 
    //    JSX DOM like this. 
    return <html>{router.result}</html>;
};
```