import {Crawler} from "./crawler"
import {HaksikType, Menu} from "../entitys/Menu";
import moment = require("moment");

export class DomitoryCrawler extends Crawler{
    constructor() {
        super("https://dorm.kumoh.ac.kr/","dorm/restaurant_menu01.do")
    }
    protected async MenuSerializtion(cafeType : string): Promise<Menu[]> {
        let menuItem: Menu[] = []
        const WeeklyMenuTable = await this.MenuTable(cafeType)
        const haksiktype = this.HaksikTypeConvertor(cafeType);


        WeeklyMenuTable.forEach((MenuTable, week) => {
            const date = moment().add(week + 1,"day")
            if(this.AfterWeak(week)) date.add(-7,"day") //한번만 삭제

            const dailyMenu = this.MenuParser(MenuTable)
            const mealTime = this.AfterWeak(week) ? "dinner" : "lunch"
            if(dailyMenu.length != 0){
                switch (haksiktype) {
                    case "riseF":
                        menuItem.push(this.createMenuItem(dailyMenu, mealTime, "riseF", date));
                        break;
                    case "riseS":
                        menuItem.push(this.createMenuItem(dailyMenu, mealTime, "riseS", date));
                        break;
                    case "poo":
                        menuItem.push(this.createMenuItem(dailyMenu, mealTime, "poo", date));
                        break;
                }
            }
        })

        return menuItem
    }
    public override async MenuList(): Promise<Menu[]> {
        return await super.MenuList(".tabmenu-wrapper > .depth3 > li")
    }

    protected MenuParser(MenuTable: Element, haksik: HaksikType = "haksik"): string[] {
        const dailyMenu: string[] = []

        MenuTable.querySelectorAll('li').forEach((x,i) => {
            dailyMenu.push(x.innerHTML)
        })
        return dailyMenu;
    }

    protected HaksikTypeConvertor(SiteEndsWith: string): HaksikType {
        if (SiteEndsWith.endsWith("01.do")) {
            return "poo"
        } else if (SiteEndsWith.endsWith("02.do")) {
            return "riseF"
        } else if (SiteEndsWith.endsWith("03.do")) {
            return "riseS"
        } else return undefined
    }

}