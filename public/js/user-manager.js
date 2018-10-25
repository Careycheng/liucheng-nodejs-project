$('.updata').click(function () {
    $('.change').show();
    $('#_id').val($(this).parent().parent().find('td').eq(0).html().replace(/\ +/g, ""));
    $('#nickname').val($(this).parent().parent().find('td').eq(2).html().replace(/\ +/g, ""));
    $('#phone').val($(this).parent().parent().find('td').eq(3).html().replace(/\ +/g, ""));
    $('#sex').val($(this).parent().parent().find('td').eq(4).html().replace(/\ +/g, ""));
    $('#age').val($(this).parent().parent().find('td').eq(5).html().replace(/\ +/g, ""));
});
$('#cancel').click(function () {
    $('.change').hide();
});

