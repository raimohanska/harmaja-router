import { h } from "harmaja"
import { ReactiveRouter } from "./ReactiveRouter"
import * as L from "lonna" 
import { renderAsString } from "./test-utils"

describe("ReactiveRouter", () => {
    const BOARD_ROUTE = "/board/:boardId"
    const ROOT_ROUTE = "/"

    const router = ReactiveRouter(
        {
            [ROOT_ROUTE]: () => <div id="root"/>,
            [BOARD_ROUTE]: ({ boardId }) => <div id="board">{ boardId }</div>,
            "": () => <div id="not-found"/>,
        },
        L.globalScope,
    )

    it("Works", () => {
        const html = <html>
            { router.result }
        </html>
        expect(renderAsString(html)).toEqual(`<html><div id="root"></div></html>`)

        router.navigateByParams(BOARD_ROUTE, { boardId : "board1" })

        expect(renderAsString(html)).toEqual(`<html><div id="board">board1</div></html>`)

        router.navigateByPath("/wrong" as any)

        expect(renderAsString(html)).toEqual(`<html><div id="not-found"></div></html>`)
    })

    // Not testing how it reacts to document location and history API yet.
})