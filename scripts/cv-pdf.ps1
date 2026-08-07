# Regenerates public/Eren_Ege_Celik_CV.pdf from the source .docx.
#
# The CV is authored in Word, not in this repo. src/lib/resume.ts mirrors it
# for /cv and /about; this script keeps the downloadable PDF in step. Run it
# after any edit to the .docx, then update resume.ts to match.
#
#   npm run cv:pdf
#
# Requires Word (COM automation). If you are on a machine without it, export
# to PDF from Word by hand and drop the file at the same path.

$ErrorActionPreference = "Stop"

$src = "$env:USERPROFILE\OneDrive\Desktop\jobapplication\Eren_Ege_Celik_CV_PredictionMarkets_v2.docx"
$out = Join-Path $PSScriptRoot "..\public\Eren_Ege_Celik_CV.pdf"
$out = [System.IO.Path]::GetFullPath($out)

if (-not (Test-Path $src)) {
  throw "Source CV not found at $src - update the path in this script."
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  # Open read-only so a copy already open in Word does not block us.
  $doc = $word.Documents.Open($src, $false, $true)
  $doc.SaveAs([ref]$out, [ref]17)   # 17 = wdFormatPDF
  $doc.Close($false)
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}

$f = Get-Item $out
Write-Output "Wrote $($f.FullName) ($([math]::Round($f.Length / 1KB)) KB)"
