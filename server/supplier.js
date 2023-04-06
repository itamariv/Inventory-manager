

const getSupplier=(name,email,address,phone)=>{
    const supplier={
        name:name,
        email:email,
        address:address,
        phone:phone,
        supplies:[]
    }
    return supplier;

}

exports.getSupplier=getSupplier;