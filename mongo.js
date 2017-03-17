 
 删：db.users.remove({name:'875696724'})
 改：db.users.update({name:'ypbw'},{$set:{type:0}})
 导出表：./mongoexport -u root -p root -d blog -c users -o /root/blog/dbbk/711/users.dat
 导入表：mongoimport -u root -p root -d blog -c users f:/db/709/users.dat

 db.users.update({name:'qingsu'},{$set:{type:0}})
db.users.remove({name:'wanggou'})
db.users.find({name:'bengou'})


mongoexport -u root -p root -d blog -c chushou -o f:/chushou.dat



db.users.remove({password:"xl320724"})