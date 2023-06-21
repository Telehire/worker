const Excel = require('exceljs')
const fs = require('fs')
const excelfile = "./副本20230606_V2_页面语言统一展示.xlsx";  //这是要导入的.xlsx文件的路径
var workbook = new Excel.Workbook();


workbook.xlsx.readFile(excelfile).then(function () {
    let zh_CN = '';
    let zh_TW = '';
    let en = '';
    let jp = '';
    for(let i = 1; i<2; i++) {
        var worksheet = workbook.getWorksheet(i); //获取第一个worksheet
        worksheet.eachRow(function (row, rowNumber) {
            // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
            if(rowNumber !== 1) {
                
                console.log('row.values', row.values[2], row.values[3], row.values[4], row.values[5])
                
                en += `\"${row.values[5].replace(/\n/g, '')}\": \"${row.values[5].replace(/\n/g, '')}\"\,\n`
                zh_CN += `\"${row.values[5].replace(/\n/g, '')}\": \"${(row.values[2].richText ? row.values[2].richText.map(obj => obj.text).join('') : row.values[2]).replace(/\n/g, '')}\"\,\n`
                zh_TW += `\"${row.values[5].replace(/\n/g, '')}\": \"${row.values[3].replace(/\n/g, '')}\"\,\n`
                jp += `\"${row.values[5].replace(/\n/g, '')}\": \"${row.values[4].replace(/\n/g, '')}\"\,\n`
            }
        });
    }
    console.log(zh_CN)
    const fs = require('fs')
// 调用fs.writeFile()方法
    fs.writeFile("./zh_CN.json",zh_CN,function(err){
        // 如果err为true，则文件写入失败，并返回失败信息
        if(err){
            return console.log('文件写入失败！'+err.message)
        }
        // 若文件写入成功，将显示“文件写入成功”
        console.log('文件写入成功！')
    });
    fs.writeFile("./zh_TW.json",zh_TW,function(err){
        // 如果err为true，则文件写入失败，并返回失败信息
        if(err){
            return console.log('文件写入失败！'+err.message)
        }
        // 若文件写入成功，将显示“文件写入成功”
        console.log('文件写入成功！')
    });
    fs.writeFile("./en.json",en,function(err){
        // 如果err为true，则文件写入失败，并返回失败信息
        if(err){
            return console.log('文件写入失败！'+err.message)
        }
        // 若文件写入成功，将显示“文件写入成功”
        console.log('文件写入成功！')
    });
    fs.writeFile("./jp.json",jp,function(err){
        // 如果err为true，则文件写入失败，并返回失败信息
        if(err){
            return console.log('文件写入失败！'+err.message)
        }
        // 若文件写入成功，将显示“文件写入成功”
        console.log('文件写入成功！')
    });
});