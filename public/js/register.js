function userRegister() {
    let userReg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,12}$/;
    let pwdReg = /^\S{6,16}$/;
    let phoneReg = /^1[34578]\d{9}$/;
    let nickNameReg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$/;
    var flag1 = false;
    var flag2 = true;
    var flag3 = false;
    var flag4 = false;
    var flag5 = true;
    //用户名验证
    $('#userName').focus(function () {
        $('#ume-prompt').show();
    }).blur(function () {
        if (userReg.test($('#userName').val())) {
            $('#ume-prompt').hide();
            flag1 = true;
            
        } else {
            $('#ume-prompt').html("用户名格式有误");
            $('#ume-prompt').css('color', 'red');
            flag1 = false;
            
        }
        verify();
    });

    //昵称验证
    $('#Nickname').focus(function () {
        console.log('进来了');
    }).blur(function () {
        if ((nickNameReg.test($('#Nickname').val()) || $('#Nickname').val() == '')) {
            $('#Nickname-prompt').hide();
            flag2 = true;
            
        } else {
            $('#Nickname-prompt').show();
            $('#Nickname-prompt').css('color', 'red');
            flag2 = false;
            
        }
        verify();
    });

    //密码验证
    $('#Password').focus(function () {
        $('#pwd-prompt').show();
    }).blur(function () {
        if (pwdReg.test($('#Password').val())) {
            $('#pwd-prompt').hide();
            flag3 = true;
            
        } else {
            $('#pwd-prompt').html("密码格式有误");
            $('#pwd-prompt').css('color', 'red');
            flag3 = false;
            
        }
        verify();
    });

    //确认密码
    $('#Repassword').focus(function () {
        $('#repwd-prompt').show();
    }).blur(function () {
        if (($('#Repassword').val()) == ($('#Password').val())) {
            $('#repwd-prompt').hide();
            flag4 = true;
            
        } else {
            $('#repwd-prompt').html("密码与上次不符");
            $('#repwd-prompt').css('color', 'red');
            flag4 = false;
            
        }
        verify();
    });

    //手机号验证
    $('#phone').focus(function () {
        console.log(111);
    }).blur(function () {
        if (phoneReg.test($('#phone').val()) || $('#phone').val() == '') {
            $('#phone-prompt').hide();
            flag5 = true;
        } else {
            $('#phone-prompt').show();
            $('#phone-prompt').css('color', 'red');
            flag5 = false;
        }
        verify();
    });



    // if (!(userReg.test($('#userName').val()))) {
    //     console.log($('#userName').val())
    //     $('#register-btn').attr('disabled', 'disabled');
    // } else {
    //     console.log(1111)
    //     $('#register-btn').removeAttr('disabled');
    //     console.log($('#userName').val())
    // }

    function verify() {
        if (flag1 && flag2 && flag3 && flag4 && flag5) {
            $('#register-btn').removeAttr('disabled');
        } else {
            $('#register-btn').attr('disabled', 'disabled');
        }
    }
    verify();
}
userRegister();
// userReg.test($('#userName').val()) && (nickNameReg.test($('#Nickname').val()) || $('#Nickname').val() === '') && pwdReg.test($('#Password').val()) && ($('#Repassword').val()) === ($('#Password').val()) && (phoneReg.test($('#phone').val()) || $('#phone').val() === '')