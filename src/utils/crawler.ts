import axios from 'axios';
import { JSDOM } from 'jsdom';
import {HaksikType, MealType, Menu} from '../entitys/Menu';
import * as moment from "moment";
export abstract class Crawler {

    private uri
    private base_uri
    protected document : Document
    constructor(base_uri : string,uri : string) {
        this.base_uri = base_uri
        this.uri = base_uri + uri
        this.document = new JSDOM().window.document
    }

    protected async getHTML(uri = this.uri) : Promise<string>{
        return new Promise(resolve => {
            axios.get(uri).then((x) => {
                if(x.status == 200){
                    resolve(x.data)
                }
            })
                .catch((x) =>{
                    resolve(x)
                })
        })
    }

    protected createHTML(innerHTML : string){
        let new_html = this.document.createElement("div")
        new_html.innerHTML = innerHTML
        return new_html
    }

    protected async MenuTabURI(quary : string){
        let result : string[]= []

        const raw_html = await this.getHTML()
        var html = this.createHTML(raw_html)

        var cafeteriaType = html.querySelectorAll(quary)
        //var cafeteriaType = html.querySelectorAll('.tabmenu-wrapper > .depth5 > li')

        for(let i = 0; i < 3; i++){
            result.push(cafeteriaType[i].querySelector("a")?.getAttribute("href") ?? "")
        }
        return result
    }

    protected async MenuTable(cafeType : string ){
        const uri = this.base_uri + cafeType
        const raw_html = await this.getHTML(uri)

        let html = this.createHTML(raw_html)

        return html.querySelectorAll("table > tbody > tr > td")
    }

    protected createMenuItem(menus : string[], meal : MealType,haksik : HaksikType,date : moment.Moment) : Menu{
        var obj = new Menu()
        const $date= moment(date)

        obj.id = `${$date.format("yyyy-MM-DD")}_${haksik}_${meal}`
        obj.date = $date.toDate()
        obj.haksikType = haksik
        obj.mealType = meal
        obj.menus = menus.join("^")

        return obj;
    }

    protected abstract MenuParser(MenuTable :Element, haksik : HaksikType) : string[];

    protected abstract MenuSerializtion(cafeType : string) : Promise<Menu[]>;

    protected abstract HaksikTypeConvertor(SiteEndsWith : string) : HaksikType;

    public async MenuList(xpath : string = "") : Promise<Menu[]>{
        let result: Menu[] = []
        const cafeteriaList =  await this.MenuTabURI(xpath)//".tabmenu-wrapper > .depth3 > li"

        for (let i =0; i < cafeteriaList.length; i++){
            const menuList = await this.MenuSerializtion(cafeteriaList[i])
            result.push(...menuList)
        }

        return result
    }

    /**
     * 인덱스가 7 이상인지 확인(일주일이 지났는지 확인)
     * @param index
     * @protected
     */
    protected AfterWeak(index: number): boolean {
        return ((index + 1) > 7)
    }
}