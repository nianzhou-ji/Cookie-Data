import {useEffect, useState} from "react";
import Tesseract from "tesseract.js";


const TestComp = () => {


    return (
        <div>
            <div className='ocr_page' id='page_1' title='image "unknown"; bbox 0 0 880 439; ppageno 0; scan_res 96 96'>
                <div className='ocr_carea' id='block_1_1' title="bbox 45 12 862 418">
                    <p className='ocr_par' id='par_1_1' lang='chi_sim' title="bbox 45 12 862 418">
   <span className='ocr_line' id='line_1_1'
         title="bbox 57 12 762 38; baseline 0 0; x_size 34.666668; x_descenders 8.666667; x_ascenders 8.666666">
    <span className='ocrx_word' id='word_1_1' title='bbox 53 8 115 51; x_wconf 24'>[ff</span>
    <span className='ocrx_word' id='word_1_2' title='bbox 171 8 236 51; x_wconf 0'>技术</span>
    <span className='ocrx_word' id='word_1_3' title='bbox 319 8 357 51; x_wconf 61'>|</span>
    <span className='ocrx_word' id='word_1_4' title='bbox 434 8 521 51; x_wconf 51'>内容</span>
    <span className='ocrx_word' id='word_1_5' title='bbox 585 8 631 51; x_wconf 40'>|</span>
    <span className='ocrx_word' id='word_1_6' title='bbox 663 8 704 51; x_wconf 9'>掌握</span>
    <span className='ocrx_word' id='word_1_7' title='bbox 703 8 739 51; x_wconf 71'>程度</span>
    <span className='ocrx_word' id='word_1_8' title='bbox 751 8 766 51; x_wconf 71'>|</span>
   </span>
                        <span className='ocr_line' id='line_1_2'
                              title="bbox 451 41 709 71; baseline 0.008 -10.031; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_9' title='bbox 451 41 506 71; x_wconf 95'>Python</span>
    <span className='ocrx_word' id='word_1_10' title='bbox 675 46 709 63; x_wconf 68'>熟练</span>
   </span>
                        <span className='ocr_line' id='line_1_3'
                              title="bbox 164 74 717 91; baseline 0 0; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_11' title='bbox 164 74 198 91; x_wconf 92'>编程</span>
    <span className='ocrx_word' id='word_1_12' title='bbox 206 74 233 91; x_wconf 96'>语言</span>
    <span className='ocrx_word' id='word_1_13' title='bbox 464 76 496 89; x_wconf 95'>C++</span>
    <span className='ocrx_word' id='word_1_14' title='bbox 666 74 717 91; x_wconf 92'>较</span>
    <span className='ocrx_word' id='word_1_15' title='bbox 693 70 709 101; x_wconf 89'>熟</span>
    <span className='ocrx_word' id='word_1_16' title='bbox 708 70 721 101; x_wconf 68'>练</span>
   </span>
                        <span className='ocr_line' id='line_1_4'
                              title="bbox 389 103 709 121; baseline 0.006 -3; x_size 17.333334; x_descenders 4.3333335; x_ascenders 4.333333">
    <span className='ocrx_word' id='word_1_17' title='bbox 389 105 573 121; x_wconf 25'>HTML、CSS、jJavaScript</span>
    <span className='ocrx_word' id='word_1_18' title='bbox 675 103 709 120; x_wconf 82'>熟练</span>
   </span>
                        <span className='ocr_line' id='line_1_5'
                              title="bbox 147 127 734 157; baseline 0.002 -10; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_19' title='bbox 147 132 161 148; x_wconf 93'>图</span>
    <span className='ocrx_word' id='word_1_20' title='bbox 167 131 190 147; x_wconf 91'>形</span>
    <span className='ocrx_word' id='word_1_21' title='bbox 189 127 207 157; x_wconf 27'>泻</span>
    <span className='ocrx_word' id='word_1_22' title='bbox 206 131 224 148; x_wconf 90'>染</span>
    <span className='ocrx_word' id='word_1_23' title='bbox 230 131 250 148; x_wconf 95'>引擎</span>
    <span className='ocrx_word' id='word_1_24' title='bbox 451 133 509 149; x_wconf 89'>Ogre3D</span>
    <span className='ocrx_word' id='word_1_25' title='bbox 648 131 664 148; x_wconf 96'>会</span>
    <span className='ocrx_word' id='word_1_26' title='bbox 673 131 712 148; x_wconf 96'>基础</span>
    <span className='ocrx_word' id='word_1_27' title='bbox 720 132 728 148; x_wconf 96'>使</span>
    <span className='ocrx_word' id='word_1_28' title='bbox 727 125 737 156; x_wconf 95'>用</span>
   </span>
                        <span className='ocr_line' id='line_1_6'
                              title="bbox 171 160 709 178; baseline 0.004 -3; x_size 17.333334; x_descenders 4.3333335; x_ascenders 4.333333">
    <span className='ocrx_word' id='word_1_29' title='bbox 171 162 185 175; x_wconf 81'>UI</span>
    <span className='ocrx_word' id='word_1_30' title='bbox 192 160 226 177; x_wconf 94'>框架</span>
    <span className='ocrx_word' id='word_1_31' title='bbox 400 162 561 178; x_wconf 91'>PyQt5、React、Vue3</span>
    <span className='ocrx_word' id='word_1_32' title='bbox 675 160 709 177; x_wconf 82'>熟练</span>
   </span>
                        <span className='ocr_line' id='line_1_7'
                              title="bbox 131 184 708 212; baseline 0.003 -9; x_size 17.333334; x_descenders 4.3333335; x_ascenders 4.333333">
    <span className='ocrx_word' id='word_1_33' title='bbox 131 184 237 212; x_wconf 82'>Web(Python)</span>
    <span className='ocrx_word' id='word_1_34' title='bbox 239 189 248 204; x_wconf 92'>框</span>
    <span className='ocrx_word' id='word_1_35' title='bbox 256 188 265 205; x_wconf 89'>架</span>
    <span className='ocrx_word' id='word_1_36' title='bbox 454 190 507 206; x_wconf 89'>Diango</span>
    <span className='ocrx_word' id='word_1_37' title='bbox 675 188 708 205; x_wconf 75'>熟练</span>
   </span>
                        <span className='ocr_line' id='line_1_8'
                              title="bbox 163 216 734 233; baseline 0.002 -1; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_38' title='bbox 163 216 198 233; x_wconf 96'>操作</span>
    <span className='ocrx_word' id='word_1_39' title='bbox 203 216 233 233; x_wconf 96'>系统</span>
    <span className='ocrx_word' id='word_1_40' title='bbox 453 218 508 231; x_wconf 96'>Ubuntu</span>
    <span className='ocrx_word' id='word_1_41' title='bbox 648 216 664 233; x_wconf 96'>会</span>
    <span className='ocrx_word' id='word_1_42' title='bbox 673 216 712 233; x_wconf 96'>基础</span>
    <span className='ocrx_word' id='word_1_43' title='bbox 720 217 728 233; x_wconf 96'>使</span>
    <span className='ocrx_word' id='word_1_44' title='bbox 727 212 737 243; x_wconf 95'>用</span>
   </span>
                        <span className='ocr_line' id='line_1_9'
                              title="bbox 45 251 112 268; baseline 0.015 -1; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_45' title='bbox 45 251 85 268; x_wconf 96'>相关</span>
    <span className='ocrx_word' id='word_1_46' title='bbox 85 251 97 268; x_wconf 93'>项</span>
    <span className='ocrx_word' id='word_1_47' title='bbox 102 252 112 267; x_wconf 89'>目</span>
   </span>
                        <span className='ocr_line' id='line_1_10'
                              title="bbox 81 272 839 290; baseline 0.003 -3; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_48' title='bbox 81 273 92 286; x_wconf 73'>&gt;</span>
    <span className='ocrx_word' id='word_1_49' title='bbox 106 272 137 289; x_wconf 95'>基于</span>
    <span className='ocrx_word' id='word_1_50' title='bbox 139 272 259 290; x_wconf 90'>Python</span>
    <span className='ocrx_word' id='word_1_51' title='bbox 195 268 209 299; x_wconf 93'>和</span>
    <span className='ocrx_word' id='word_1_52' title='bbox 208 272 259 290; x_wconf 86'>PyQt5，</span>
    <span className='ocrx_word' id='word_1_53' title='bbox 274 272 290 289; x_wconf 92'>作</span>
    <span className='ocrx_word' id='word_1_54' title='bbox 295 273 315 289; x_wconf 95'>为</span>
    <span className='ocrx_word' id='word_1_55' title='bbox 317 272 325 289; x_wconf 93'>项</span>
    <span className='ocrx_word' id='word_1_56' title='bbox 334 272 353 289; x_wconf 93'>目</span>
    <span className='ocrx_word' id='word_1_57' title='bbox 363 273 383 289; x_wconf 90'>骨干</span>
    <span className='ocrx_word' id='word_1_58' title='bbox 388 268 405 299; x_wconf 91'>，</span>
    <span className='ocrx_word' id='word_1_59' title='bbox 404 272 428 289; x_wconf 93'>参</span>
    <span className='ocrx_word' id='word_1_60' title='bbox 435 273 444 288; x_wconf 95'>与</span>
    <span className='ocrx_word' id='word_1_61' title='bbox 443 268 451 299; x_wconf 96'>了</span>
    <span className='ocrx_word' id='word_1_62' title='bbox 451 274 459 287; x_wconf 96'>6</span>
    <span className='ocrx_word' id='word_1_63' title='bbox 464 272 477 289; x_wconf 96'>个</span>
    <span className='ocrx_word' id='word_1_64' title='bbox 483 272 523 289; x_wconf 96'>仿真</span>
    <span className='ocrx_word' id='word_1_65' title='bbox 532 272 558 289; x_wconf 96'>集成</span>
    <span className='ocrx_word' id='word_1_66' title='bbox 558 272 571 289; x_wconf 97'>和</span>
    <span className='ocrx_word' id='word_1_67' title='bbox 573 272 610 289; x_wconf 96'>优化</span>
    <span className='ocrx_word' id='word_1_68' title='bbox 609 272 644 289; x_wconf 96'>软件</span>
    <span className='ocrx_word' id='word_1_69' title='bbox 646 272 665 289; x_wconf 96'>项</span>
    <span className='ocrx_word' id='word_1_70' title='bbox 664 268 689 299; x_wconf 96'>目的</span>
    <span className='ocrx_word' id='word_1_71' title='bbox 698 272 730 289; x_wconf 93'>开发</span>
    <span className='ocrx_word' id='word_1_72' title='bbox 735 268 750 299; x_wconf 92'>，</span>
    <span className='ocrx_word' id='word_1_73' title='bbox 749 273 760 288; x_wconf 92'>已</span>
    <span className='ocrx_word' id='word_1_74' title='bbox 768 272 785 288; x_wconf 96'>全</span>
    <span className='ocrx_word' id='word_1_75' title='bbox 790 274 796 289; x_wconf 96'>部</span>
    <span className='ocrx_word' id='word_1_76' title='bbox 797 272 839 289; x_wconf 93'>验收</span>
    <span className='ocrx_word' id='word_1_77' title='bbox 834 268 843 299; x_wconf 82'>。</span>
   </span>
                        <span className='ocr_line' id='line_1_11'
                              title="bbox 81 293 671 311; baseline -0.002 -1; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_78' title='bbox 81 294 92 307; x_wconf 90'>&gt;</span>
    <span className='ocrx_word' id='word_1_79' title='bbox 107 293 137 310; x_wconf 95'>基于</span>
    <span className='ocrx_word' id='word_1_80' title='bbox 142 295 171 308; x_wconf 96'>C++</span>
    <span className='ocrx_word' id='word_1_81' title='bbox 174 293 188 310; x_wconf 96'>和</span>
    <span className='ocrx_word' id='word_1_82' title='bbox 191 295 258 311; x_wconf 91'>OpenCV，</span>
    <span className='ocrx_word' id='word_1_83' title='bbox 273 293 365 310; x_wconf 92'>开</span>
    <span className='ocrx_word' id='word_1_84' title='bbox 300 289 321 319; x_wconf 96'>发</span>
    <span className='ocrx_word' id='word_1_85' title='bbox 320 289 329 319; x_wconf 93'>了</span>
    <span className='ocrx_word' id='word_1_86' title='bbox 328 293 364 310; x_wconf 92'>DX11</span>
    <span className='ocrx_word' id='word_1_87' title='bbox 377 293 398 310; x_wconf 96'>项</span>
    <span className='ocrx_word' id='word_1_88' title='bbox 408 293 432 310; x_wconf 96'>目的</span>
    <span className='ocrx_word' id='word_1_89' title='bbox 431 289 445 319; x_wconf 96'>AR</span>
    <span className='ocrx_word' id='word_1_90' title='bbox 457 295 486 308; x_wconf 92'>HUD</span>
    <span className='ocrx_word' id='word_1_91' title='bbox 491 293 504 310; x_wconf 18'>畸</span>
    <span className='ocrx_word' id='word_1_92' title='bbox 510 293 533 310; x_wconf 90'>变</span>
    <span className='ocrx_word' id='word_1_93' title='bbox 532 289 558 319; x_wconf 94'>校正</span>
    <span className='ocrx_word' id='word_1_94' title='bbox 566 293 586 310; x_wconf 92'>图</span>
    <span className='ocrx_word' id='word_1_95' title='bbox 585 289 602 319; x_wconf 92'>像</span>
    <span className='ocrx_word' id='word_1_96' title='bbox 602 293 611 309; x_wconf 93'>生</span>
    <span className='ocrx_word' id='word_1_97' title='bbox 618 293 640 310; x_wconf 96'>成</span>
    <span className='ocrx_word' id='word_1_98' title='bbox 639 289 664 319; x_wconf 93'>程序</span>
    <span className='ocrx_word' id='word_1_99' title='bbox 667 305 671 309; x_wconf 36'>。</span>
   </span>
                        <span className='ocr_line' id='line_1_12'
                              title="bbox 45 336 114 353; baseline 0.014 -1; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_100' title='bbox 45 336 79 353; x_wconf 96'>技能</span>
    <span className='ocrx_word' id='word_1_101' title='bbox 87 336 114 353; x_wconf 89'>储备</span>
   </span>
                        <span className='ocr_line' id='line_1_13'
                              title="bbox 81 357 862 375; baseline 0.003 -3; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_102' title='bbox 81 358 92 371; x_wconf 93'>&gt;</span>
    <span className='ocrx_word' id='word_1_103' title='bbox 108 357 151 374; x_wconf 95'>自学</span>
    <span className='ocrx_word' id='word_1_104' title='bbox 150 353 159 384; x_wconf 83'>了</span>
    <span className='ocrx_word' id='word_1_105' title='bbox 158 358 221 375; x_wconf 89'>Ogre3D</span>
    <span className='ocrx_word' id='word_1_106' title='bbox 222 357 233 373; x_wconf 53'>泻</span>
    <span className='ocrx_word' id='word_1_107' title='bbox 241 357 260 374; x_wconf 88'>染</span>
    <span className='ocrx_word' id='word_1_108' title='bbox 265 357 296 374; x_wconf 88'>引擎</span>
    <span className='ocrx_word' id='word_1_109' title='bbox 295 353 312 384; x_wconf 96'>的</span>
    <span className='ocrx_word' id='word_1_110' title='bbox 311 357 351 374; x_wconf 96'>基本</span>
    <span className='ocrx_word' id='word_1_111' title='bbox 359 358 373 374; x_wconf 96'>使</span>
    <span className='ocrx_word' id='word_1_112' title='bbox 378 370 379 374; x_wconf 87'>用</span>
    <span className='ocrx_word' id='word_1_113' title='bbox 400 357 410 374; x_wconf 87'>做</span>
    <span className='ocrx_word' id='word_1_114' title='bbox 416 358 426 373; x_wconf 96'>了</span>
    <span className='ocrx_word' id='word_1_115' title='bbox 433 365 445 366; x_wconf 92'>一</span>
    <span className='ocrx_word' id='word_1_116' title='bbox 454 357 475 374; x_wconf 93'>些</span>
    <span className='ocrx_word' id='word_1_117' title='bbox 484 353 504 384; x_wconf 46'>学习</span>
    <span className='ocrx_word' id='word_1_118' title='bbox 500 359 548 373; x_wconf 92'>demo，</span>
    <span className='ocrx_word' id='word_1_119' title='bbox 563 357 597 374; x_wconf 91'>包</span>
    <span className='ocrx_word' id='word_1_120' title='bbox 586 353 603 384; x_wconf 92'>括</span>
    <span className='ocrx_word' id='word_1_121' title='bbox 602 353 608 384; x_wconf 55'>;</span>
    <span className='ocrx_word' id='word_1_122' title='bbox 623 357 650 374; x_wconf 96'>数字</span>
    <span className='ocrx_word' id='word_1_123' title='bbox 656 357 676 373; x_wconf 93'>时</span>
    <span className='ocrx_word' id='word_1_124' title='bbox 679 357 692 374; x_wconf 92'>钟</span>
    <span className='ocrx_word' id='word_1_125' title='bbox 697 353 711 384; x_wconf 93'>、</span>
    <span className='ocrx_word' id='word_1_126' title='bbox 705 357 781 374; x_wconf 92'>动</span>
    <span className='ocrx_word' id='word_1_127' title='bbox 731 353 748 384; x_wconf 93'>态</span>
    <span className='ocrx_word' id='word_1_128' title='bbox 747 357 781 374; x_wconf 75'>纹理</span>
    <span className='ocrx_word' id='word_1_129' title='bbox 784 353 798 384; x_wconf 93'>、</span>
    <span className='ocrx_word' id='word_1_130' title='bbox 797 357 809 373; x_wconf 92'>基</span>
    <span className='ocrx_word' id='word_1_131' title='bbox 815 358 827 374; x_wconf 96'>于</span>
    <span className='ocrx_word' id='word_1_132' title='bbox 832 357 846 374; x_wconf 96'>位</span>
    <span className='ocrx_word' id='word_1_133' title='bbox 852 358 862 374; x_wconf 96'>图</span>
   </span>
                        <span className='ocr_line' id='line_1_14'
                              title="bbox 103 378 233 395; baseline 0.008 -1; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_134' title='bbox 103 378 148 395; x_wconf 96'>进行</span>
    <span className='ocrx_word' id='word_1_135' title='bbox 147 374 172 405; x_wconf 78'>文字</span>
    <span className='ocrx_word' id='word_1_136' title='bbox 180 379 207 395; x_wconf 89'>展示</span>
    <span className='ocrx_word' id='word_1_137' title='bbox 215 378 233 395; x_wconf 41'>等</span>
   </span>
                        <span className='ocr_line' id='line_1_15'
                              title="bbox 81 400 601 418; baseline 0.002 -2; x_size 22.274509; x_descenders 5.5686274; x_ascenders 5.5686274">
    <span className='ocrx_word' id='word_1_138' title='bbox 81 401 92 414; x_wconf 92'>&gt;</span>
    <span className='ocrx_word' id='word_1_139' title='bbox 106 400 137 417; x_wconf 96'>基于</span>
    <span className='ocrx_word' id='word_1_140' title='bbox 139 400 253 418; x_wconf 57'>Django</span>
    <span className='ocrx_word' id='word_1_141' title='bbox 197 396 211 427; x_wconf 92'>和</span>
    <span className='ocrx_word' id='word_1_142' title='bbox 210 400 253 418; x_wconf 91'>Vue3，</span>
    <span className='ocrx_word' id='word_1_143' title='bbox 270 400 285 417; x_wconf 90'>将</span>
    <span className='ocrx_word' id='word_1_144' title='bbox 294 400 320 417; x_wconf 96'>单机</span>
    <span className='ocrx_word' id='word_1_145' title='bbox 328 400 349 417; x_wconf 96'>版</span>
    <span className='ocrx_word' id='word_1_146' title='bbox 357 400 363 417; x_wconf 96'>的</span>
    <span className='ocrx_word' id='word_1_147' title='bbox 363 400 391 417; x_wconf 95'>仿真</span>
    <span className='ocrx_word' id='word_1_148' title='bbox 400 400 438 417; x_wconf 96'>集成</span>
    <span className='ocrx_word' id='word_1_149' title='bbox 446 400 462 417; x_wconf 91'>软件</span>
    <span className='ocrx_word' id='word_1_150' title='bbox 470 400 490 417; x_wconf 92'>重</span>
    <span className='ocrx_word' id='word_1_151' title='bbox 500 401 510 417; x_wconf 93'>构</span>
    <span className='ocrx_word' id='word_1_152' title='bbox 517 402 525 415; x_wconf 93'>为</span>
    <span className='ocrx_word' id='word_1_153' title='bbox 524 396 541 427; x_wconf 91'>B/S</span>
    <span className='ocrx_word' id='word_1_154' title='bbox 547 400 558 417; x_wconf 90'>架</span>
    <span className='ocrx_word' id='word_1_155' title='bbox 567 400 576 417; x_wconf 93'>构</span>
    <span className='ocrx_word' id='word_1_156' title='bbox 584 400 593 417; x_wconf 93'>的</span>
    <span className='ocrx_word' id='word_1_157' title='bbox 597 412 601 416; x_wconf 92'>。</span>
   </span>
                    </p>
                </div>
            </div>


        </div>
    );

}

export default TestComp;
