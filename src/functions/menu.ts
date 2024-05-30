import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ApplicationContext } from "../ApplicationContext";
import type { MealType,HaksikType } from "../entitys/Menu";
import { Menu } from "../entitys/Menu";
import {ResBody} from "../ResBody";
import * as moment from "moment";
export async function fetchMenu(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    //const name = request.query.get('name') || await request.text() || 'world';
    var $context = await ApplicationContext;
    if(!$context.isInitialized){
        $context.initialize()
    }

    let $meal : MealType
    let $type : HaksikType
    let $date : Date

    const res = new ResBody<Menu>()

    const rawMealType = request.query.get("meal")
    const rawHaksikType = request.query.get("type")
    const rawDate = request.query.get("date")

    if (rawMealType === "lunch" || rawMealType === "breakfast" || rawMealType === "dinner") {
        $meal = rawMealType;
    }else{
        res.setErrorMsg("meal type is not valid")
        return { body: res.ToString()  };

    }
    if(rawHaksikType == "haksik" || rawHaksikType == "snack" || rawHaksikType == "pro"
        || rawHaksikType == "riseF" || rawHaksikType == "riseS" || rawHaksikType == "poo"){
        $type = rawHaksikType
    }else{
        res.setErrorMsg("haksik type is not valid")
        return { body: res.ToString()  };
    }
    if(rawDate){
        $date = moment(rawDate,"yyyy-MM-dd").toDate()
    }
    else{
        $date = new Date()
    }

    const foundItem = await $context.getRepository(Menu)
        .createQueryBuilder()
        .where("haksikType = :type", {type : $type})
        .andWhere("mealType = :meal", {meal : $meal})
        .andWhere("date = :date", {date : $date})
        .getOne()

    if(!foundItem){
        res.setErrorMsg("menus not found")
    }else{
        res.data = foundItem
    }

    return { body: res.ToString()  };
}

app.http('menu', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: fetchMenu
});