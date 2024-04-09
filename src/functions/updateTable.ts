import { app, InvocationContext, Timer } from "@azure/functions";
import {ApplicationContext} from "../ApplicationContext";
import {Menu} from "../entitys/Menu";
import {HaksikCralwer} from "../utils/haksikCrwaler";
import {DomitoryCrawler} from "../utils/domitoryCrawler";

export async function updateMenu(myTimer: Timer, context: InvocationContext): Promise<void> {
    var $context = await ApplicationContext;
    if(!$context.isInitialized){
        $context.initialize()
    }
    context.log('Timer function processed request.');
    context.log(`current Time is ${Date.now()}`)

    const t = new HaksikCralwer()
    const d = new DomitoryCrawler()
    const d_menuList = (await d.MenuList())
    const menuList = (await t.MenuList())
    menuList.push(...d_menuList)

    $context.getRepository(Menu).insert(menuList)
}

app.timer('updateMenu', {
    schedule: '0 0 21 * * Sun',
    handler: updateMenu,
    runOnStartup : false
});