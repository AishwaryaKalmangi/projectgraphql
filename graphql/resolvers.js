const Recipe = require('../models/Recipe');

module.exports = {
    Query:{
        async recipe(_,{ID}){
            return await Recipe.findById(ID)
        },
        //show most recent recipes
        async getRecipes(_,{amount}){
            return await Recipe.find().sort({createdAt: -1}).limit(amount)
        },
    },
    Mutation:{
        async createRecipe(_,{recipeInput:{name, description}}){
            //create an instance
            const createdRecipe = new Recipe({
                name: name,
                description: description,
                createdAT: new Date().toISOString(),
                thumbsUp:0,
                thumbsDown:0
            });
            const res =  await createdRecipe.save(); //Mongodb savings
            console.log(res._doc);
            return {
                id: res.id,
                ...res._doc
            }
        },
        async deleteRecipe(_,{ID}){
           const wasDeleted = (await Recipe.deleteOne({
            _id:ID
           })).deletedCount;
           return wasDeleted // 1 if something was deleted, 0 if not
        },
        async editRecipe(_, {ID, recipeInput: {name, description}}){
            //return object
            const wasEdited = (await Recipe.updateOne({ _id: ID}, { name: name, description: description})).modifiedCount;
            return wasEdited; //1 if something was edited, 0 if nothing
        }

    }

}