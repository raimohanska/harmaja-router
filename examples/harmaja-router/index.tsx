import { h, mount } from "harmaja";
import { Link, HarmajaRouter, getNavigator } from "../../src";

// 1. Define some routes
const BOARD_ROUTE = "/board/:boardId";
const ROOT_ROUTE = "/";
const routes = {
    [ROOT_ROUTE]: () => <Home />,
    [BOARD_ROUTE]: ({ boardId }) => <Board boardId={boardId} />,
    "": () => <div id="not-found">Not found</div>,
};
type Routes = typeof routes;

const App = () => {
    // 2. Create a router that maps routes to route handlers. The router exposes the
    //    result of the current route handler as the result value, so you can just
    //    embed it in your JSX.

    return <html>{HarmajaRouter(routes)}</html>;
};

const Home = () => {
    // 4. You can now use the Link component to create links that use the router for navigation.
    //    The `href` attribute is type-safe.

    //    You can also use `getNavigator` to get programmatic access to navigation.
    const navigator = getNavigator<Routes>();
    return (
        <div id="root">
            <h1>Welcome</h1>
            <ul>
                {/* For static routes, you can create links type-safely simply like this */}
                <li>
                    <Link<Routes> href="/board/board1">Board 1</Link>
                </li>
                {/* For dynamic routes, you can create links type-safely like this */}
                <li>
                    <Link<Routes> route={BOARD_ROUTE} boardId="board2">
                        Board 2
                    </Link>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="/board/board2"
                        onClick={(e) => {
                            navigator.navigateByPath("/board/board2");
                            e.preventDefault();
                        }}
                    >
                        Board 2 - programmatic
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a
                        href="/board/board3"
                        onClick={(e) => {
                            navigator.navigateByParams(BOARD_ROUTE, {
                                boardId: "board3",
                            });
                            e.preventDefault();
                        }}
                    >
                        Board 3 - programmatic
                    </a>
                </li>
            </ul>
        </div>
    );
};

const Board = ({ boardId }: { boardId: string }) => {
    return (
        <div id="board">
            <h1>{boardId}</h1>
            <p>
                <Link<Routes> href="/">All boards</Link>
            </p>
        </div>
    );
};

mount(<App />, document.getElementById("root")!);
