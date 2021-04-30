//offline data
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            //multiple tabs open at once
            console.log("Persistence failed");
        } else if (err.code == 'unimplemented') {
            //lack of browser support
            console.log("Persistence is not available");
        }
    })

db.collection('recipes').onSnapshot((snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change => {
        console.log(change, change.doc.data(), change.doc.id);
        if (change.type === 'added') {
            // add the document data to the web page
            renderRecipe(change.doc.data(), change.doc.id)
        }
        if (change.type === 'removed') {
            // remove the document data to the web page
            removeRecipe(change.doc.id);
        }

    });
})

//add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(recipe)
        .catch(err => console.log(err))

    form.title.value = '';
    form.ingredients.value = '';
})

//delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
    if (evt.target.tagName === 'I') {
        const id = evt.target.getAttribute('data-id');
        //console.log(id);
        db.collection('recipes').doc(id).delete();
    }
})