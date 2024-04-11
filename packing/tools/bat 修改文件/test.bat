@echo off
setlocal enabledelayedexpansion

set "sourceFile=test.txt"
set "tempFile=temp.txt"
set "oldString=念洲"
set "newString=念洲吸怪"

if not exist "%sourceFile%" (
    echo Source file not found!
    goto end
)

> "%tempFile%" (
    for /f "delims=" %%a in ('type "%sourceFile%" ^| findstr /n /r "^"') do (
        set "line=%%a"
        set "line=!line:*:=!"
        set "modified=!line:%oldString%=%newString%!"
        echo(!modified!
    )
)

move /y "%tempFile%" "%sourceFile%" > nul

:end
endlocal


msg * "修改文件成功"