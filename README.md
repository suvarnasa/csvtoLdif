Look at the data.js file to create mappings and add data not present in the csv. 
Look at the .env file for the names of the csv to pick up and the Ldif to be created. 
There can be any number of fields to the csv. They will be added to LDIF. If mappings are present they will be mapped to the attribute mentioned in mapping.
Rest will be added as is. 

Make sure the mappings reflect actual attributes from the objectclass. 
To run use command: node csvtoldif.js

