
//specify the unique attribute. It could be the uid or cn etc. It will be user to create the RDN e.x uid=09123,dc=sample,dc=com
const uniqueattrib = "uid";

//use below to add whats not present in the cvs like objectclass, accExpired etc 
const ldifEntry={                          
    objectclass: [
        "inetorgPerson",
        "AccountObj",
        "top"
    ], 
    dn: "ou=temp,dc=iamsecurity,dc=xyz",  
//  accExpired:"FALSE"

}

//use below to map from csv to ldif attribute example firstname in csv cloumn name = cn in LDAP.
const mappings={
    firstname : "cn",
    lastname : "sn",
    fullname : 'uid',
    managerid : "manager",
    inactiveidentity : "accDisabled",
    email : "mail",
}

module.exports={uniqueattrib,ldifEntry,mappings};