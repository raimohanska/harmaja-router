## harmaja-router

A naive little JavaScript/TypeScript request routing library that allows you to define your routes in a typesafe manner - it forces your route handlers match the parameters defined in your routes. Inspired by [typera](https://github.com/akheron/typera) which provides similar typesafe routing on the server side.

The library is written primarily for use with the [Harmaja](https://github.com/raimohanska/harmaja) rendering library but, despite its name, is not actually anyhow dependent on Harmaja.

### ReactiveRouter

See [full example](examples/reactive-router/index.tsx). You can also run the example app with `yarn exampl`.

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

### Link

TODO! There's no useful Link component yet, as it would need means for passing a reference to 
the router. Currently thinking about adding Context support to Harmaja to make this practical.