Attribute VB_Name = "modulo_orcafascio"
Sub limpar_abc_insumos()
'
' limpar_abc_insumos Macro
'

' limpa duas ultimas colunas em branco
    Columns("P:Q").Delete
' limpa coluna quantidade improdutiva
    Columns("G:G").Delete
' limpa coluna valor unit improdutivo
    Columns("H:H").Delete
' limpa colunas valor total produtivo e Improdutivo
    Columns("I:J").Delete
' limpa linha em branco de cabeçalho
    Rows("5:5").Delete Shift:=xlUp
    Rows("4:4").EntireRow.AutoFit
    Rows("4:4").HorizontalAlignment = xlCenter
' limpa linha de totais
    Dim lin_fim As Integer
    lin_fim = Range("A5").End(xlDown).row
    Rows(lin_fim + 1 & ":" & lin_fim + 18).Delete
' linha de subtotal
    Range("H" & lin_fim + 1).Formula = "=SUBTOTAL(9,H5:H" & lin_fim & ")"

' converte texto para valor
    Dim vArray As Variant
    vArray = Range("F5:H" & lin_fim).Value2
    Dim i As Integer
    Dim j As Integer
    For i = 1 To lin_fim - 4
        For j = 1 To 3
            vArray(i, j) = vArray(i, j) * 1
        Next j
    Next i
    Range("F5:H" & lin_fim).Value2 = vArray
    Range("G5:H" & lin_fim + 1).NumberFormat = "0.00"

' define formulas das colunas
' colunas Peso
    With Range("I5")
        .Formula = "=H5/$H$" & (lin_fim + 1)
        .NumberFormat = "0.00%"
        .AutoFill Destination:=Range("I5:I" & lin_fim)
        
    End With
' colunas Valor Acumulado
    With Range("J5")
        .Formula = "=SUBTOTAL(9,INDIRECT(""H5:H""&ROW(H5)))"
        .AutoFill Destination:=Range("J5:J" & lin_fim)
    End With
' coluna peso acumulado
    With Range("K5")
        .Formula = "=J5/$H$" & (lin_fim + 1)
        .NumberFormat = "0.00%"
        .AutoFill Destination:=Range("K5:K" & lin_fim)
    End With
    
' formatação condicional ABC 80%/95%
    With Range("A5:K" & lin_fim).FormatConditions
        .Add Type:=xlExpression, Formula1:="=$K5<=0,80"
        .Add Type:=xlExpression, Formula1:="=$K5<=0,95"
        .Add Type:=xlExpression, Formula1:="=$K5>0,95"
        
        .Item(1).Interior.ThemeColor = xlThemeColorDark1
        .Item(1).Interior.TintAndShade = -0.25
        .Item(2).Interior.ThemeColor = xlThemeColorDark2
        .Item(3).Interior.ThemeColor = xlThemeColorAccent4
        .Item(3).Interior.TintAndShade = 0.5
    End With
    
' organiza os filtros
    Range("A4:K4").AutoFilter
    
    Application.Goto Reference:=Range("A1"), Scroll:=True
    Range("A5").Activate
    ActiveWindow.FreezePanes = True
    Application.ActiveSheet.CustomProperties.Add Name:="ABC_limpa", Value:="true"
    
End Sub

Sub limpar_orc_sintetico()
'
' limpar_orc_sintetico Macro
'

' primeiro detecta se é orçamento com equipamento
    Dim equip As Boolean
    equip = Range("i5").Value2 = "EQ."

' deleta col totais e linha
    If equip = True Then
        Columns("K:K").Delete
    Else
        Columns("J:J").Delete
    End If
    
    Rows(2).EntireRow.AutoFit
    With Rows(3)
        .MergeCells = False
        .WrapText = False
        .HorizontalAlignment = xlLeft
    End With
    Dim lin_fim As Integer
    lin_fim = Range("A6").End(xlDown).row
    Rows(lin_fim + 2 & ":" & lin_fim + 7).Delete

' insere campos novos
    If equip = True Then
        Columns("K:N").Insert Shift:=xlToRight, CopyOrigin:=xlFormatFromLeftOrAbove
        Range("K4:K5").Merge
        Range("K4").Value = "TERC"
        Range("H4:J5").Copy Range("L4:N5")
    Else
        Columns("J:L").Insert Shift:=xlToRight, CopyOrigin:=xlFormatFromLeftOrAbove
        Range("J4:J5").Merge
        Range("J4").Value = "TERC"
        Range("H4:I5").Copy Range("K4:L5")
    End If
    Range("H4").Value = "Valor Unit"

' aplica filtro
        Range("A5:R5").AutoFilter
        Range("A5:R5").HorizontalAlignment = xlCenter

' insere campos BDIs diferentes
    If equip = True Then
        With Range("K1:N1")
            .MergeCells = True
            .Value = "BDIs Diferenciados"
            .HorizontalAlignment = xlCenter
        End With
        Range("K2").Value = "TERC"
        Range("L2").Value = "M.O."
        Range("M2").Value = "EQ."
        Range("N2").Value = "MAT."
    
        Range("K3").Value = "50%"
        Range("L3").Value = "35%"
        Range("M3").Value = "20%"
        Range("N3").Value = "20%"
    Else
        With Range("J1:L1")
            .MergeCells = True
            .Value = "BDIs Diferenciados"
            .HorizontalAlignment = xlCenter
        End With
        Range("J2").Value = "TERC"
        Range("K2").Value = "M.O."
        Range("L2").Value = "MAT."
    
        Range("J3").Value = "50%"
        Range("K3").Value = "35%"
        Range("L3").Value = "20%"
    End If
    
' preparar formulas
    Dim tabela As Range
    Set tabela = Range("G6:R" & lin_fim)
    Dim row As Range
    Dim cell As Range
    Dim lin As Integer
    
    If equip = True Then
        For Each row In tabela.Rows
            lin = row.row
            ' se linha de etapa
            If IsEmpty(row.Cells(1)) Then
                ' soma MO
                row.Cells(9).Formula = "=SUMIFS(O:O, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                ' soma EQ
                row.Cells(10).Formula = "=SUMIFS(P:P, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                ' soma MAT
                row.Cells(11).Formula = "=SUMIFS(Q:Q, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                ' soma total
                row.Cells(12).Formula = "=SUMIFS(R:R, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                
                ' estiliza
                With Range(row.Cells(9), row.Cells(12))
                    .HorizontalAlignment = xlRight
                    .NumberFormat = "#,##0.00"
                End With
                
            ' se linha de item
            Else
                ' unitario MO
                row.Cells(6).Formula = "=TRUNC(H" & lin & " * (1+IF(ISBLANK(K" & lin & "),$L$3,$K$3)), 2)"
                ' unitario EQ
                row.Cells(7).Formula = "=TRUNC(I" & lin & " * (1+$M$3), 2)"
                ' unitario MAT
                row.Cells(8).Formula = "=TRUNC(J" & lin & " * (1+$N$3), 2)"
                
                ' totais
                row.Cells(9).Formula = "=TRUNC($F" & lin & " * $L" & lin & " , 2)"
                row.Cells(10).Formula = "=TRUNC($F" & lin & " * $M" & lin & " , 2)"
                row.Cells(11).Formula = "=TRUNC($F" & lin & " * $N" & lin & " , 2)"
                row.Cells(12).Formula = "=TRUNC($F" & lin & " * SUM(L" & lin & ":N" & lin & ") , 2)"
                
            End If
        Next row
    ' linha de totais
        Range("O" & lin_fim + 1).Formula = "=SUMIFS(O:O,$B:$B,""<>"")"
        Range("P" & lin_fim + 1).Formula = "=SUMIFS(P:P,$B:$B,""<>"")"
        Range("Q" & lin_fim + 1).Formula = "=SUMIFS(Q:Q,$B:$B,""<>"")"
        Range("R" & lin_fim + 1).Formula = "=SUMIFS(R:R,$B:$B,""<>"")"
    Else
        For Each row In tabela.Rows
            lin = row.row
            ' se linha de etapa
            If IsEmpty(row.Cells(1)) Then
                ' soma MO
                row.Cells(7).Formula = "=SUMIFS(M:M, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                ' soma MAT
                row.Cells(8).Formula = "=SUMIFS(N:N, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                ' soma total
                row.Cells(9).Formula = "=SUMIFS(O:O, $A:$A,"" ""&TRIM($A" & lin & ")&"".*"", $B:$B, ""<>"")"
                
                ' estiliza
                With Range(row.Cells(7), row.Cells(9))
                    .HorizontalAlignment = xlRight
                    .NumberFormat = "0.00"
                End With
                
            ' se linha de item
            Else
                ' unitario MO
                row.Cells(5).Formula = "=TRUNC(H" & lin & " * (1+IF(ISBLANK(H" & lin & "),$J$3,$H$3)), 2)"
                ' unitario MAT
                row.Cells(6).Formula = "=TRUNC(I" & lin & " * (1+$L$3), 2)"
                
                ' totais
                row.Cells(7).Formula = "=TRUNC($F" & lin & " * $K" & lin & " , 2)"
                row.Cells(8).Formula = "=TRUNC($F" & lin & " * $L" & lin & " , 2)"
                row.Cells(9).Formula = "=TRUNC($F" & lin & " * SUM(K" & lin & ":L" & lin & ") , 2)"
                
            End If
        Next row
    ' linha de totais
        Range("M" & lin_fim + 1).Formula = "=SUMIFS(M:M,$B:$B,""<>"")"
        Range("N" & lin_fim + 1).Formula = "=SUMIFS(N:N,$B:$B,""<>"")"
        Range("O" & lin_fim + 1).Formula = "=SUMIFS(O:O,$B:$B,""<>"")"
    End If
    
    With Rows(lin_fim + 1)
        .HorizontalAlignment = xlRight
        .VerticalAlignment = xlCenter
        .NumberFormat = "#,##0.00"
        .RowHeight = 20
    End With
    
    
' fixa linha cabeçalho
    Application.Goto Reference:=Range("A1"), Scroll:=True
    Range("A6").Activate
    ActiveWindow.FreezePanes = True
    Application.ActiveSheet.CustomProperties.Add Name:="ORC_limpo", Value:="true"
    
End Sub
