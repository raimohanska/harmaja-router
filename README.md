## harmaja-router

A naive little JavaScript/TypeScript request routing library that allows you to define your routes in a typesafe manner - it forces your route handlers match the parameters defined in your routes. Inspired by [typera](https://github.com/akheron/typera) which provides similar typesafe routing on the server side.

The library is written primarily for use with the [Harmaja](https://github.com/raimohanska/harmaja) rendering library but, despite its name, is not actually anyhow dependent on Harmaja.

### ReactiveRouter

See [full example](examples/reactive-router/index.tsx). You can also run the example app with `yarn exampl`.

```ts
const App = () => {
    const router = ReactiveRouter(
        {
            [ROOT_ROUTE]: () => <Home />,
            [BOARD_ROUTE]: ({ boardId }) => <Board boardId={boardId} />,
            "": () => <div id="not-found">Not found</div>,
        },
        L.globalScope
    );

    // To navigate type-safely to a known route in your application:
    router.navigateByParams(BOARD_ROUTE, { boardId: "board1" });

    // To navigate to an arbitrary path you'll need a cast to any, because
    // even the navigateByPath is type safe.

    router.navigateByPath("/some/path" as any);

    return <html>{router.result}</html>;
};
```
