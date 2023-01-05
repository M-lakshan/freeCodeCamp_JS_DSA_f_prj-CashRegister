function checkCashRegister(price, cash, cid) {
    let current_value = 0;
    let change = amount_determine(parseFloat(price),parseFloat(cash));
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

    function status_confirm(sts) {
        switch(sts) {
            case "OPEN":
                return_sts["status"] = "OPEN";
            break;
            case "INSUFFICIENT_FUNDS":
                return_sts["status"] = "INSUFFICIENT_FUNDS";
                return_sts["change"] = [];
            break;
            case "CLOSED":
                return_sts["status"] = "CLOSED";
                return_sts["change"] = [["PENNY", 0],["NICKEL", 0],["DIME", 0],["QUARTER", 0],["ONE", 0],
                                        ["FIVE", 0],["TEN", 0],["TWENTY", 0],["ONE HUNDRED", 0]];
            break;
            case "sts_pending":

            break;
        }
    }

    function amount_determine(promt,intake) {
        if(intake-promt < 0.05) { return "PENNY"; }
        else if(intake-promt < 0.1 && intake-promt >= 0.05) { return "NICKEL"; }
        else if(intake-promt < 0.25 && intake-promt >= 0.1) { return "DIME"; }
        else if(intake-promt < 1 && intake-promt >= 0.25) { return "QUARTER"; }
        else if(intake-promt < 5 && intake-promt >= 1) { return "ONE"; }
        else if(intake-promt < 10 && intake-promt >= 5) { return "FIVE"; }
        else if(intake-promt < 20 && intake-promt >= 10) { return "TEN"; }
        else if(intake-promt < 100 && intake-promt >= 20) { return "TWENTY"; }
        else if(intake-promt >= 100) { return "ONE HUNDRED"; }
    }

    function amount_generate(intake,promt,main_ctg) {
        let count = 0;
        let compare_val = intake-promt;
        let ctg_calc = ""
        current_value = 0;

        if(intake!=promt) {
            switch(main_ctg) {
                case "PENNY": ctg_calc = amount_calculate(0.01,0.01,0.01,"PENNY","PENNY"); break;
                case "NICKEL": ctg_calc = amount_calculate(0.05,0.01,0.01,"PENNY","PENNY"); break;
                case "DIME": ctg_calc = amount_calculate(0.1,0.05,0.01,"NICKLE","PENNY"); break;
                case "QUARTER": ctg_calc = amount_calculate(0.25,0.1,0.05,"DIME","NICKLE"); break;
                case "ONE": ctg_calc = amount_calculate(1,0.25,0.1,"QUARTER","DIME"); break;
                case "FIVE": ctg_calc = amount_calculate(5,1,0.25,"ONE","QUARTER"); break;
                case "TEN": ctg_calc = amount_calculate(10,5,1,"FIVE","ONE"); break;
                case "TWENTY": ctg_calc = amount_calculate(20,10,5,"TEN","FIVE"); break;
                case "ONE HUNDRED": ctg_calc = amount_calculate(100,20,10,"TWENTY","TEN"); break;
            }
            
            switch(ctg_calc) {
                case "ctg_val_alt_i_redirect": case "ctg_val_alt_ii_redirect":
                    return amount_generate(compare_val,current_value,amount_determine(current_value,compare_val));
                case "funds_insuficient": status_confirm("INSUFFICIENT_FUNDS"); break;
                case "funds_transfered": status_confirm("OPEN"); break;
            }
        } else {
            status_confirm("OPEN");
        }

        function amount_calculate(ctg_val,ctg_val_alt_i,ctg_val_alt_ii,ctg_val_alt_i_n,ctg_val_alt_ii_n) {
            if(compare_val < moneyDrawer[main_ctg]*ctg_val) {
                while(count<parseInt(compare_val/ctg_val)) { current_value+=ctg_val; moneyDrawer[main_ctg]--; count++; }
                return_sts["change"].push([main_ctg,current_value]);

                if((compare_val)!=current_value) {
                    if(moneyDrawer[ctg_val_alt_i_n]*ctg_val_alt_i - (compare_val-current_value)!=0) {
                        return "ctg_val_alt_i_redirect";
                    } else if(moneyDrawer[ctg_val_alt_ii_n]*ctg_val_alt_ii - ((intake-promt)-current_value)!=0) {
                        return "ctg_val_alt_ii_redirect";
                    } else {
                        return "funds_insuficient";
                    }
                } else { return "funds_transfered"; }
            } else if(compare_val == moneyDrawer[main_ctg]*ctg_val) {
                while(current_value<parseFloat(compare_val)) { current_value+=ctg_val; }
                return_sts["change"].push([main_ctg,current_value]);
                return "funds_transfered";
            } else { return "funds_insuficient"; }
        }        
    }

    switch(change) {
        case "PENNY":
            if(moneyDrawer["PENNY"]*0.01 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"PENNY");
            } else { status_confirm("sts_pending"); }
        break;
        case "NICKEL":
            if(moneyDrawer["NICKEL"]*0.05 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"NICKEL");
            } else { status_confirm("sts_pending"); }
        break;
        case "DIME":
            if(moneyDrawer["DIME"]*0.1 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"DIME");
            } else { status_confirm("sts_pending"); }
        break;
        case "QUARTER":
            if(moneyDrawer["QUARTER"]*0.25 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"QUARTER");
            } else { status_confirm("sts_pending"); }
        break;
        case "ONE":
            if(moneyDrawer["ONE"] - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"ONE");
            } else { status_confirm("sts_pending"); }
        break;
        case "FIVE":
            if(moneyDrawer["FIVE"]*5 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"FIVE");
            } else { status_confirm("sts_pending"); }
        break;
        case "TEN":
            if(moneyDrawer["TEN"]*10 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"TEN");
            } else { status_confirm("sts_pending"); }
        break;
        case "TWENTY":
            if(moneyDrawer["TWENTY"]*20 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"TWENTY");
            } else { status_confirm("sts_pending"); }
        break;
        case "ONE HUNDRED":
            if(moneyDrawer["ONE HUNDRED"]*100 - (parseFloat(cash)-parseFloat(price))!=0) {
                amount_generate(parseFloat(cash),parseFloat(price),"ONE HUNDRED");
            } else { status_confirm("sts_pending"); }
        break;
    }

    return return_sts;
}

checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
