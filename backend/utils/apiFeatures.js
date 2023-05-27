class ApiFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options:"i" //case insensitive 
            }
        }:{};

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy = {...this.queryStr};

        //removing some fields for category

        const removeFields = ["keyword","page","limit",];
        removeFields.forEach(key=>delete queryStrCopy[key]);

        //Filter for price and Rating 

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, '$$' + "$1");

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures