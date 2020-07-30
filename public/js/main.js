$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        $target=$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type: "DELETE",
            url: "/articles/"+id,
            success: function(response){
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    })
    $('.delete-comment').on('click', function(e){
        $target=$(e.target);
        const id=$target.attr('comment-id');
        const article=$target.attr('article');
        $.ajax({
            type: "DELETE",
            url: "/comments/"+id,
            success: function(response){
                window.location.href='/articles/'+article;
            },
            error: function(err){
                console.log(err);
            }
        });
    })
});