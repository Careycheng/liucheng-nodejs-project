function userRegister() {
    let userReg = /^\w{5,12}$/;
    let pwdReg = /^\S{6,16}$/;
    let phoneReg = /^1[34578]\d{9}$/;

    //用户名验证
    $('#userName').focus(function () {
        $('#ume-prompt').show();
    }).blur(function () {
        if (userReg.test($('#userName').val())) {
            $('#ume-prompt').hide();
        } else {
            $('#ume-prompt').html("用户名格式有误");
            $('#ume-prompt').css('color', 'red');
        }
    });

    //密码验证
    $('#Password').focus(function () {
        $('#pwd-prompt').show();
    }).blur(function () {
        if (pwdReg.test($('#Password').val())) {
            $('#pwd-prompt').hide();
        } else {
            $('#pwd-prompt').html("密码格式有误");
            $('#pwd-prompt').css('color', 'red');
        }
    });

    //确认密码
    $('#Repassword').focus(function () {
        $('#repwd-prompt').show();
    }).blur(function () {
        if (($('#Repassword').val()) == ($('#Password').val())) {
            $('#repwd-prompt').hide();
        } else {
            $('#repwd-prompt').html("密码与上次不符");
            $('#repwd-prompt').css('color', 'red');
        }
    });

    //

    // $("#register-btn").click(function () {
    //     if ((userReg.test($("#userName").val())) && (pwdReg.test($("#Password").val())) && ($("#Repassword").val() == $("#Password").val())) {
    //         // location.href = "../login.html";
    //     } else {
    //         $(this).attr("disabled", "disabled ")
    //     }
    // });

}
userRegister();