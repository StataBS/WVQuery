<?php 
error_reporting(E_ALL); 
$root="/home/statatld/public_html/"; 
 
//call: e.g. http://mietpreisraster.statabs.ch/?rect=6@59,57,10,6|7@11,88,275,6@89,35,10,135|8@0,0,297,210#page=7 
//call for mpr: e.g. http://mietpreisraster.statabs.ch/?rect=6@59,57,10,6@60,58,11,7#page=7 
//pages: 6-11 
//pagesize: 290 x 210 (A4, Landscape) 
 
	$default = false; 
	if (isset($_GET['rect'])) { 
		 
		$tmp = $_GET['rect']; 
		 
		//split by | -> get pages if set, else only one page 
		if (strpos($tmp, "|")) $p = explode("|", $tmp);  
		else $p[0] = $tmp; 
 
		//pages 
		foreach ($p as $k => $v) { 
			// rectangles 
			if (strpos($v, "@")) { 
				$r = explode("@", $v);  
				$page = array_shift($r); 
				foreach ($r as $rid => $rparams) { 
					// each rectangle 
					$c[$page][$rid] = explode(",", $rparams); 
					if (count($c[$page][$rid]) != 4) $default = true; 
					foreach ($c[$page][$rid] as $kk => $vv) if (!is_numeric($vv)) $default = true;; 
				} 
			} else $default = true; 
		} 
	} 
	if ($default) $c = array(6 => [0 => [59,57,10,6]]); 
	 
	//print_r($c); 
   
	//$filename = "http://www.statistik.bs.ch/dam/jcr:d444a374-e326-4b84-83b3-75424ecb1927/Mietpreisraster-2018-08.pdf"; 
	$filename = 'Mietpreisraster.pdf'; 
 
	require_once('fpdiUserExtensions.php'); 
	 
 
	// initiate PDF 
	$pdf = new PDF(); 
 
	/* 
	// go to first page 
	$pdf->nextPage(); 
	// add content to current page 
	$pdf->SetFont("helvetica", "", 20); 
	$pdf->SetTextColor(220, 20, 60); 
	$pdf->Text(50, 20, "I should not be here!"); 
	*/ 
 
	// get the page count 
	$pageCount = $pdf->setSourceFile($filename); 
	$pageNo = $page;

	$templateId = $pdf->importPage($pageNo); 
 
	$pdf->AddPage(); 
	 
	// use the imported page and adjust the page size 
	$pdf->useTemplate($templateId, ['adjustPageSize' => true]); 
	 
	$pdf->SetAlpha(0.5, 'Darken'); //Blend Mode "Darken": creates a pixel that retains the smallest components of the foreground and background pixels. 
	$pdf->SetFillColor(255,255,0); 
	foreach ($c[$pageNo] as $rid => $p) { 
		$pdf->Rect($p[0], $p[1], $p[2], $p[3], 'F');//, $style4, array(220, 220, 200)); 
	}
	//$pdf->SetDrawColor(255,0,0);
	//$pdf->SetLineWidth(1);
	$pdf->SetFillColor(0,200,0); 
	
	// define the intersection rectangle of the row and the line rectangle
	// $c[$pageNo][0]: row rectangle; $c[$pageNo][1]: column rectangle
	// $c[$pageNo][1][0]: xOrigin of col; $c[$pageNo][0][1]: yOrigin of row; $c[$pageNo][1][2]: xExtension of col; $c[$pageNo][0][3]: yExtension of row
	$pdf->Rect($c[$pageNo][1][0], $c[$pageNo][0][1], $c[$pageNo][1][2], $c[$pageNo][0][3], 'F');
	
	// iterate through all pages 
	for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) { 
		 
		// import a page 
		$templateId = $pdf->importPage($pageNo); 
 
		$pdf->AddPage(); 
		 
		// use the imported page and adjust the page size 
		$pdf->useTemplate($templateId, ['adjustPageSize' => true]); 
		 
		if (isset($c[$pageNo])){ 
			$pdf->SetAlpha(0.5, 'Darken'); //Blend Mode "Darken": creates a pixel that retains the smallest components of the foreground and background pixels. 
			$pdf->SetFillColor(255,255,0); 
			foreach ($c[$pageNo] as $rid => $p) { 
				$pdf->Rect($p[0], $p[1], $p[2], $p[3], 'F');//, $style4, array(220, 220, 200)); 
			}
			//$pdf->SetDrawColor(255,0,0);
			//$pdf->SetLineWidth(1);
			$pdf->SetFillColor(0,200,0); 
			
			// define the intersection rectangle of the row and the line rectangle
			// $c[$pageNo][0]: row rectangle; $c[$pageNo][1]: column rectangle
			// $c[$pageNo][1][0]: xOrigin of col; $c[$pageNo][0][1]: yOrigin of row; $c[$pageNo][1][2]: xExtension of col; $c[$pageNo][0][3]: yExtension of row
			$pdf->Rect($c[$pageNo][1][0], $c[$pageNo][0][1], $c[$pageNo][1][2], $c[$pageNo][0][3], 'F');
		} 
		 
/* 
		$pdf->SetAlpha(1); 
		// use the imported page and adjust the page size 
		$pdf->useTemplate($templateId, ['adjustPageSize' => true]); 
*/ 
		 
	} 
 
	//jump to page 
	 
 
	//show the PDF in page 
	$pdf->Output(); 
/* 
Output 
string Output([string dest [, string name [, boolean isUTF8]]]) 
 
Parameters 
 
dest 
    Destination where to send the document. It can be one of the following: 
 
        I: send the file inline to the browser. The PDF viewer is used if available. 
        D: send to the browser and force a file download with the name given by name. 
        F: save to a local file with the name given by name (may include a path). 
        S: return the document as a string. 
 
    The default value is I.  
name 
    The name of the file. It is ignored in case of destination S. 
    The default value is doc.pdf.  
*/ 
?>