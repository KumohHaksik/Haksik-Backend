import moment = require("moment")
import {HaksikType, MealType, Menu} from "../entitys/Menu"
import {Crawler} from "./crawler"

export class HaksikCralwer extends Crawler {
    constructor() {
        super("https://www.kumoh.ac.kr/ko/", "restaurant01.do")
    }

    public async MenuList(): Promise<Menu[]> {
        return await super.MenuList(".tabmenu-wrapper > .depth5 > li")
    }

    //하나의 식당의 테이블을 파싱함
    protected async MenuSerializtion(cafeType: string): Promise<Menu[]> {
        let menuItem: Menu[] = []

        const WeeklyMenuTable = await this.MenuTable(cafeType)
        const haksiktype = this.HaksikTypeConvertor(cafeType);
        WeeklyMenuTable.forEach((MenuTable, week) => {
            const date = moment().add(week + 1,"day").add(-2 , "day")
            if(this.AfterWeak(week)) date.add(-7,"day")
            //각 요일의 테이블 안에서 메뉴 추출
            const dailyMenu = this.MenuParser(MenuTable, haksiktype)

            if (dailyMenu.length != 0) {
                switch (haksiktype) {
                    case "haksik":
                        menuItem.push(this.createMenuItem(dailyMenu, this.AfterWeak(week) ? "lunch" : "breakfast", "haksik", date));
                        break;
                    case "pro":
                        menuItem.push(this.createMenuItem(dailyMenu, this.AfterWeak(week) ? "dinner" : "lunch", "pro", date));
                        break;
                    case "snack":
                        menuItem.push(this.createMenuItem(dailyMenu, "lunch", "snack", date));
                        break;
                }
            }
        })
        return menuItem
    }

    protected HaksikTypeConvertor(SiteEndsWith : string): HaksikType {
        if (SiteEndsWith.endsWith("01.do")) {
            return "haksik"
        } else if (SiteEndsWith.endsWith("02.do")) {
            return "pro"
        } else if (SiteEndsWith.endsWith("04.do")) {
            return "snack"
        } else return undefined
    }

    private getDate(date: moment.Moment, index: number): moment.Moment {
        if (this.AfterWeak(index)) {
            date.add(-7)
        }
        return date
    }

    /*
    * @param index index must start at 0
    * @returns first week : true, second week : false
    */
    protected MenuParser(MenuTable: Element, haksik: HaksikType) {
        const dailyMenu: string[] = []
        const excludeIndex = [0,1]
        MenuTable.querySelectorAll('li').forEach((menu, index) => {
            if (haksik == "snack") {
                dailyMenu.push(menu.innerHTML)
            } else if (!excludeIndex.includes(index)) {
                dailyMenu.push(menu.innerHTML)
            }
        })
        return dailyMenu
    }
}