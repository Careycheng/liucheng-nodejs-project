$(function () {
    $('.add-phone').click(function () {
        $('.upload_form').show();
    });
    $('.upload_form #cancel').click(function () {
        $('.upload_form').hide();
    });

    $('.upload_form #submit').click(function () {
        var name = $('#name').val();
        var brand = $('#brand').val();
        var official_guide_price = $('#official_guide_price').val();
        var recovery_price = $('#recovery_price').val();
        var fileObj = $('#phoneImg')[0].files[0];
        var fileForm = new FormData();
        fileForm.append('name', name);
        fileForm.append('brand', brand);
        fileForm.append('official_guide_price', official_guide_price);
        fileForm.append('recovery_price', recovery_price);
        fileForm.append('phoneImg', fileObj);
        console.log(fileObj);
        var data = fileForm;
        if (typeof fileObj == 'undefined' || fileObj.size <= 0) {
            alert('请选择图片');
            return;
        }

        $.ajax({
            type: "post",
            url: "/phone/add",
            data: data,
            cach: false,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                search();
            }
        });
        $('.upload_form').hide();
    });
    search();
    function search() {
        $.ajax({
            type: 'get',
            url: '/phone/search',
            success: function (res) {
                //循环下面的页码
                var str = `<li>
                            <a href="#" class="Previous">
                                <span>&laquo;</span>
                            </a>
                        </li>`;
                for (var i = 0; i < res.data.totalPage; i++) {
                    str += `<li><a href="javascript:;">${i + 1}</a></li>`;
                }
                str += `<li>
                        <a href="#" class="Next">
                            <span>&raquo;</span>
                        </a>
                    </li>`;
                $('.pagination').html(str);
                //循环拼接数据
                var html = '';
                for (var i = 0; i < res.data.phoneList.length; i++) {
                    html += `<tr>
                            <td>${res.data.phoneList[i]._id}</td>
                            <td>
                                <img src='/phone/${res.data.phoneList[i].imgSrc}'>
                            </td>
                            <td>${res.data.phoneList[i].name}</td>
                            <td>${res.data.phoneList[i].brand}</td>
                            <td>${res.data.phoneList[i].official_guide_price}</td>
                            <td>${res.data.phoneList[i].recovery_price}</td>
                            <td>
                                <a href="javascript:;" class="change">修改</a>
                                <a href="javascript:;" class="del">删除</a>
                            </td>
                        </tr>`;
                }
                $('.tbody').html(html);
            }
        })
    }
    $('.pagination').on('click', 'li', function (e) {
        // search();
        e.preventDefault();
        var page = $(this).find('a').html();
        $.ajax({
            type: 'get',
            url: '/phone/search',
            data: {
                page: page
            },
            success: function (res) {
                console.log(res);
                //循环拼接数据
                var html = '';
                for (var i = 0; i < res.data.phoneList.length; i++) {
                    html += `<tr>
                            <td>${res.data.phoneList[i]._id}</td>
                            <td>
                                <img src='/phone/${res.data.phoneList[i].imgSrc}'>
                            </td>
                            <td>${res.data.phoneList[i].name}</td>
                            <td>${res.data.phoneList[i].brand}</td>
                            <td>${res.data.phoneList[i].official_guide_price}</td>
                            <td>${res.data.phoneList[i].recovery_price}</td>
                            <td>
                                <a href="" class="change">修改</a>
                                <a href="" class="del">删除</a>
                            </td>
                        </tr>`;
                }
                $('.tbody').html(html);
                // search();
            }
        });
    });
    $('.tbody').on('click', '.change', function () {
        $('.update_form').show();
        $('#_Id').val($(this).parent().parent().find('td').eq(0).html());
        $('#Name').val($(this).parent().parent().find('td').eq(2).html());
        $('#Brand').val($(this).parent().parent().find('td').eq(3).html());
        $('#Official_guide_price').val($(this).parent().parent().find('td').eq(4).html());
        $('#Recovery_price').val($(this).parent().parent().find('td').eq(5).html());
    });
    $('.update_form #cancel').on('click', function () {
        $('.update_form').hide();
    })
    $('.update_form #submit').on('click', function () {
        var fileObj = $('#PhoneImg')[0].files[0];
        console.log(fileObj)
        var fileForm = new FormData();
        fileForm.append('_Id', $('#_Id').val());
        fileForm.append('Name', $('#Name').val());
        fileForm.append('Brand', $('#Brand').val());
        fileForm.append('Official_guide_price', $('#Official_guide_price').val());
        fileForm.append('Recovery_price', $('#Recovery_price').val());
        fileForm.append('PhoneImg', fileObj);
        // console.log(fileObj)
        var data = fileForm;
        if (typeof fileObj == 'undefined' || fileObj.size <= 0) {
            alert('请选择图片');
            return;
        }
        $.ajax({
            type: "post",
            url: "/phone/update",
            data: data,
            cach: false,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log(res);
                search();
            }
        });
        $('.update_form').hide();
        // search();
    })
    // search();
    $('.tbody').on("click", ".del", function () {
        console.log(22222)
        var idNum = $(this).parent().parent().find('td').eq(0).html();
        console.log(idNum,'++++++++++++++++++++++++++++')
        $.ajax({
            type: 'post',
            url: '/phone/delete',
            data: {
                id: idNum
            },
            success: function (result) {
                console.log(result, 'result输出了');
                search();
            }
        })
    })

});