import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ApplicationContext } from "../ApplicationContext";
import type { MealType,HaksikType } from "../entitys/Menu";
import { Menu } from "../entitys/Menu";
import {ResBody} from "../ResBody";
import * as moment from "moment";
export async function fetchMenus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    //const name = request.query.get('name') || await request.text() || 'world';
    var $context = await ApplicationContext;
    if(!$context.isInitialized){
        $context.initialize()
    }

    let $meal : MealType
    let $type : HaksikType
    let $startDate : string
    let $endDate : string

    const res = new ResBody<Menu[]>()

    const rawMealType = request.query.get("meal")
    const rawHaksikType = request.query.get("type")
    const rawStartDate = request.query.get("start")
    const rawEndDate = request.query.get("end")

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

    if(rawStartDate){
        $startDate = rawStartDate//moment(rawStartDate,"yyyy-MM-dd")
    }
    else{
        res.setErrorMsg("start date not found")
        return { body: res.ToString()  };
    }
    if(rawEndDate){
        $endDate = rawEndDate//moment(rawEndDate,"yyyy-MM-dd")
    }
    else{
        res.setErrorMsg("end date not found")
        return { body: res.ToString()  };
    }

    const foundItem = await $context.getRepository(Menu)
        .createQueryBuilder()
        .where("haksikType = :type", {type : $type})
        .andWhere("mealType = :meal", {meal : $meal})
        .andWhere("date BETWEEN :start AND :end", {start: $startDate, end: $endDate})
        .getMany()

    if(!foundItem){
        res.setErrorMsg("menus not found")
    }else{
        res.data = foundItem
    }
    return { body: res.ToString()  };
}

app.http('menus', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: fetchMenus
});