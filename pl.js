//configuration
var ewOptions = {
    'EW_COUNT_PER_PAGE': 20,
    'category':'general'
};    

//English words object
var EngWordsObject = {
    container:'#b-ewords',
    
    //load data from server
    load:function(){        
        $.ajax({
            url : '/pl/load_eng_words',
            type: 'POST',
            dataType: 'json',
            data : ewOptions,
            success : function(data) {               
                EngWordsObject.display(data);
            }
        });
    },
    //display data on HTML page
    display:function(data){
                      
        var html = '';
        var bgClass = 'even';
        
        //prepare html output
        $.each(data.words, function(index, item) {
            bgClass = bgClass=='odd'?'even':'odd';
            html += '<div class="item '+bgClass+'" wid="' + item.id + '">';
            html +='';    
            //status
            var status = '';
            for (var i = 0; i < item.status; i++){
                status+='+ ';
            }
            html += '<a href="#" class="plus1">+1</a>';
            html += '<a href="#" class="minus_all">- all</a>';
            html += '<span class="rate">'+status+'</span>';
            html += '<a href="#" class="btn-edit wlist"><div class="wid">'+item.id+'</div><span class="word">'+item.word+'</span></a>';            
            html += '<div class="l-edit">';            
            html += '<a href="#" class="btn-edit"><img height="20" src="../images/edit.png" /></a>';
            html += '<a href="#" class="btn-delete"><img height="20" src="../images/delete.jpg" /></a>';            
            html += '</div>';
            html += '</div>';
        });        
        //set inner html
        $(EngWordsObject.container).html(html);
                        
        //add
        
        //process
        $('.btn-edit').click(function(){
            var wordId = $(this).closest('div.item').attr('wid');
            EngWordsObject.update_word(wordId);
        });
        
        //delete
        $('.btn-delete').click(function(){
            if (confirm('Do you realy want to delete this item')){
                var wordId = $(this).closest('div.item').attr('wid');
                EngWordsObject.delete_word(wordId);
            }
        }); 
        
        //update status
        $('.plus1').click(function(){
            var wordId = $(this).closest('div.item').attr('wid');
            EngWordsObject.set_status(wordId, '+1');
        });
        
        //update status
        $('.minus_all').click(function(){
            var wordId = $(this).closest('div.item').attr('wid');
            EngWordsObject.set_status(wordId, '0');
        });
    },
    set_status:function(id, status){
        $.ajax({
            url : '/pl/set_status',
            type: 'POST',
            dataType: 'json',
            data : {
                'id':id,
                'status':status
            },
            success : function(data) {
                EngWordsObject.load();
            }
        });
    },    
    add_word:function(){      
        var newWord = prompt("Enter new word which you want to add here");
        if (newWord){
             $.ajax({
                url : '/pl/add_word',
                type: 'POST',
                dataType: 'json',
                data : {
                    'word':newWord
                },
                success : function(data) {
                    EngWordsObject.load();
                }
            });
        }           
    },
    
    update_word:function(id){
        var oldWord = $("div[wid="+id+"] .word").html();
        var newWord = prompt("Enter new word here", oldWord);
        
        if (newWord){
            $.ajax({
                url : '/pl/update_word',
                type: 'POST',
                dataType: 'json',
                data : {
                    'id':id,
                    'word':newWord
                },
                success : function(data) {               
                    EngWordsObject.load();
                }
            });
        }
    },
    delete_word:function(id){
        $.ajax({
            url : '/pl/delete_word',
            type: 'POST',
            dataType: 'json',
            data : {
                'id':id
            },
            success : function(data) {               
                EngWordsObject.load();
            }
        });
    }
}

//on ready dom execute
$(document).ready(function(){
    EngWordsObject.load();
        
    $('.btn-add_word').click(function(){
        EngWordsObject.add_word();
    });                
        
});