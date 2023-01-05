function checkCashRegister(prc, csh, cid) {
    let price = parseFloat(Math.round(prc*Math.pow(10,2))/Math.pow(10,2));
    let cash = parseFloat(Math.round(csh*Math.pow(10,2))/Math.pow(10,2));
    let current_value = 0;
    let change = amount_determine(cash,price);
    let moneyDrawer_arr = [];
    const return_sts = { "status": "", "change": [] };
    const moneyDrawer = {
        "PENNY": 0, "NICKEL": 0,
        "DIME": 0, "QUARTER": 0,
        "ONE": 0, "FIVE": 0,
        "TEN": 0, "TWENTY": 0,
        "ONE HUNDRED": 0
    }

    cid.forEach(drawer => {
        let type = "";
        let value = "";

        drawer.map((validity,index) => { (index==0) ? type=validity : value=parseFloat(validity); });

        moneyDrawer[type] = value;
    });

    function moneyDrawer_keyNames(name) {
        switch(name) { //obj_key_names
            case "PENNY": return [0.01,"PENNY"];
            case "NICKEL": return [0.05,"PENNY"];
            case "DIME": return [0.1,"NICKEL"];
            case "QUARTER": return [0.25,"DIME"];
            case "ONE": return [1,"QUARTER"];
            case "FIVE": return [5,"ONE"];
            case "TEN": return [10,"FIVE"];
            case "TWENTY": return [20,"TEN"];
            case "ONE HUNDRED": return [100,"TWENTY"];
        }
    }

    function status_confirm(sts) {
        switch(sts) {
            case "OPEN": 
                return_sts["status"] = "OPEN";
            break;
            case "CLOSED":
                return_sts["status"] = "CLOSED";
            break;
            case "INSUFFICIENT_FUNDS":
                return_sts["status"] = "INSUFFICIENT_FUNDS";
                return_sts["change"] = [];
            break;
        }
    }

    function amount_determine(intake,promt) {
        let diff_amt = Math.round((intake-promt)*Math.pow(10,2))/Math.pow(10,2);
        if(diff_amt < 0.05) { return "PENNY"; }
        else if(diff_amt < 0.1 && diff_amt >= 0.05) { return "NICKEL"; }
        else if(diff_amt < 0.25 && diff_amt >= 0.1) { return "DIME"; }
        else if(diff_amt < 1 && diff_amt >= 0.25) { return "QUARTER"; }
        else if(diff_amt < 5 && diff_amt >= 1) { return "ONE"; }
        else if(diff_amt < 10 && diff_amt >= 5) { return "FIVE"; }
        else if(diff_amt < 20 && diff_amt >= 10) { return "TEN"; }
        else if(diff_amt < 100 && diff_amt >= 20) { return "TWENTY"; }
        else if(diff_amt >= 100) { return "ONE HUNDRED"; }
    }
    
    function amount_validate(ctg,intake_alt,promt_alt) {
        let balance_sts = true;
        let recurrent_index = 8;
        let backup_from = [];
        let difference_amount = intake_alt-promt_alt;

        switch(ctg) { //obj_key_name
            case "PENNY": recurrent_index=0; break;
            case "NICKEL": recurrent_index=1; break;
            case "DIME": recurrent_index=2; break;
            case "QUARTER": recurrent_index=3; break;
            case "ONE": recurrent_index=4; break;
            case "FIVE": recurrent_index=5; break;
            case "TEN": recurrent_index=6; break;
            case "TWENTY": recurrent_index=7; break;
            case "ONE HUNDRED": recurrent_index=8; break;
        }

        for(let i=0; i < Object.keys(moneyDrawer).length; i++) {
            moneyDrawer_arr.push([
                (Object.keys(moneyDrawer)[i]),
                moneyDrawer_keyNames((Object.keys(moneyDrawer)[i]))[0],
                parseFloat(moneyDrawer[Object.keys(moneyDrawer)[i]]),
                Math.round(
                    (parseFloat(moneyDrawer[Object.keys(moneyDrawer)[i]]) / moneyDrawer_keyNames((Object.keys(moneyDrawer)[i]))[0])
                    * Math.pow(10,2)
                ) / Math.pow(10,2)
            ]);
        }

        while(balance_sts && recurrent_index >= 0) {
            if(difference_amount >= moneyDrawer_arr[recurrent_index][2]) {
                if(moneyDrawer_arr[recurrent_index][2] != 0) {
                    difference_amount = Math.round(
                                            (difference_amount - moneyDrawer_arr[recurrent_index][2]) * Math.pow(10,2)
                                        ) / Math.pow(10,2);
                    backup_from.push([moneyDrawer_arr[recurrent_index][0],moneyDrawer_arr[recurrent_index][3]]);
                }
                balance_sts = true;
            } else {
                let count = 1;
                while((count * moneyDrawer_arr[recurrent_index][1]) <= difference_amount) { count++; }
                if((count * moneyDrawer_arr[recurrent_index][1]) > difference_amount) { count-- }
                if(count != 0) {
                    difference_amount = Math.round(
                                            (difference_amount - moneyDrawer_arr[recurrent_index][1] * count)
                                        * Math.pow(10,2))/Math.pow(10,2)
                    backup_from.push([moneyDrawer_arr[recurrent_index][0],count]);
                }
                balance_sts = true;
            }

            if(recurrent_index == 0 && difference_amount == 0 && backup_from.length == 0) {
                balance_sts = false;
            }

            recurrent_index--;
        }

        return (backup_from.length != 0 && difference_amount == 0) ? [true,backup_from] : [false,""];
    }
    
    function amount_calculate(result_arr) {
        let count = 0;
        let recurring_val = 0;
        let recurring_arr = 0;
        let moneyDrawer_obj_copy = Object.assign({}, moneyDrawer);
        let status = '';
        current_value = 0;

        while(recurring_arr < result_arr.length) {
            recurring_val = moneyDrawer_keyNames(result_arr[recurring_arr][0])[0] * result_arr[recurring_arr][1];
            current_value = Math.round((current_value + recurring_val) * Math.pow(10,2)) / Math.pow(10,2);
            
            return_sts["change"].push([result_arr[recurring_arr][0],recurring_val]);

            moneyDrawer_obj_copy[result_arr[recurring_arr][0]] = Math.round((moneyDrawer_obj_copy[result_arr[recurring_arr][0]] - recurring_val) * Math.pow(10,2)) / Math.pow(10,2);
            recurring_arr++;
        }

        for(let i=0; i < Object.keys(moneyDrawer_obj_copy).length; i++) {
            if(moneyDrawer_obj_copy[(Object.keys(moneyDrawer_obj_copy)[i])]==0) { count++; }
        }

        if(count == Object.keys(moneyDrawer).length) {
            return_sts["change"] = [];
            for(let i=0; i < Object.keys(moneyDrawer).length; i++) {
                return_sts["change"].push([
                    (Object.keys(moneyDrawer)[i]),
                    parseFloat(moneyDrawer[Object.keys(moneyDrawer)[i]])
                ]);
            }
            status = "CLOSED";
        } else {
            status = "OPEN";
        }

        return status_confirm(status);
    }

    let amt_validate = amount_validate(change,cash,price);

    if(amt_validate[0]) {
        amount_calculate(amt_validate[1]);
    } else { status_confirm("INSUFFICIENT_FUNDS"); }

    return return_sts;
}
  
// should return {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}.
console.log(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));


// should return {status: "INSUFFICIENT_FUNDS", change: []}.
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));


// should return {status: "INSUFFICIENT_FUNDS", change: []}.
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));


// should return {status: "OPEN", change: [["QUARTER", 0.5]]}.
console.log(checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));

// should return {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}.
console.log(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
