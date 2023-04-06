


const supplierPlaceHolder={
    name:"None"
}


const getItem=(name,quantity)=>{
    const item={
        name:name,
        quantity:quantity,
        supplier:{name:'None'}
    }
    return item;
}



const setSupplier=(itemName,supplier)=>{
//find user with cookie
//go to user's items list -> itemName -> set supplier to supplier
//* on frontend - show only supplier's name which will be a link to supplier's page, under suppliers page
}

// const newProperty=(itemName,propName)=>{
//     //find user with cookie
//     //go to user's items list -> itemName -> set all instances propName value to 0
//     //frontend page of this item will now have option to set new prop value 
// }

//const newInstance=()

exports.getItem=getItem;