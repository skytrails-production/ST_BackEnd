class Internationalapi {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){     
        const keyword = this.queryStr.keyword ?{
            destination:{
                $elemMatch: {
                    addMore:{
                        $regex: this.queryStr.keyword,
                        $options: "i"
                    }
                }
            },  
        }:{};
        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        var copyQuery = {...this.queryStr};
        const removeField = ["keyword","page"];
        removeField.forEach((key)=> delete copyQuery[key]);
        let filterquery = JSON.stringify(copyQuery);
        filterquery = filterquery.replace((key)=>`${key}`);
        // filterquery = filterquery.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        filterquery = JSON.parse(filterquery);
        console.log(this.queryStr.filter);
        // const filter = this.queryStr.filter ?{
        //     // select_tags:{
        //     //     $in:[this.queryStr.filter]
        //     // },
        //     days:this.queryStr.filter,
        // }:{};{ days: { $gte: this.queryStr.filter } }
        this.query = this.query.find({ days: { $gte: this.queryStr.filter } });
        return this;
    }
    pagintion(pagintionData){
        
        let currentPage = Number(this.queryStr.page) || 1;

        let skip = pagintionData*(currentPage - 1);

        this.query = this.query.limit(pagintionData).skip(skip);
        return this;

    }
}

module.exports = Internationalapi;