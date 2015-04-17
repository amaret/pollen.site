<h1 id="grammar" class="page-header">Pollen Grammar</h1>

The grammar listed below is a representation of the actual Pollen grammar that is streamlined for 
readability. The product version is an antlr3 grammar. Specific
questions on Pollen that are not fully answered in the documentation may be
addressed in the grammar below. 

    unit     // A unit is a file containing a Pollen type.
        :    NL? unitPackage   
        ;
    unitPackage    
        :    stmtPackage?
             importList 
             stmtInjectionList 
             unitTypeDefinition
             stmtInjectionList
             NL?
             pollenEOF
        ;
    pollenEOF
        :    EOF
        ;
    stmtInjectionList 
        :    stmtInjection* 
        ;
    stmtPackage
        :    'package' qualName NL  
        ;
    stmtExport
        :    'export' qualName delim 
        ;
    classDefinition  
        :    'class' IDENT
              extendsClause
              implementsClause
              braceOpenNL classFeatureList NL? braceCloseNL
        ;
    classFeatureList
        :    classFeature* 
        ;
    classFeature 
        :    fcnDefinitionVoidOrCtor
        |    fcnDefinition    
        |    enumDefinition
        |    fieldDeclaration
        |    classDefinition
        |    injectionDecl
        ; 
    
    moduleDefinition 
        :    'module' IDENT
              extendsClause
              implementsClause
              NL? braceOpenNL moduleFeatureList NL? braceCloseNL
        ;
       
    moduleFeatureList
        :    moduleFeature*    
        ;
    moduleFeature
        :    fcnDefinitionVoidOrCtor
        |    fcnDefinition
        |    varDeclarationNew
        |    varDeclaration 
        |    enumDefinition
        |    classDefinition 
        |    injectionDecl 
        ;
    enumDefinition
        :    'public'?    // Note outermost enum cannot have the public attribute
             'enum'
             enumBodyDefinition
        ;
    enumBodyDefinition
        :    IDENT braceOpenNL enumList braceCloseNL
        ;
    enumList
        :    enumElement (',' NL? enumElement)* NL? 
        ;
    
    // Note defaults are assigned for missing values
    enumElement
        :    IDENT ASSIGN enumVal
        |    IDENT     // missing value
        ;
    enumVal
        :    INT_LIT  
        |    OCT_LIT 
        |    HEX_LIT 
        ;
    protocolDefinition
        :    'protocol' IDENT
             extendsClause
             implementsClause
             NL? braceOpenNL protocolFeatureList NL? braceCloseNL 
        ;
    protocolFeatureList
        :    protocolFeature* 
        ;
    protocolFeature
        :    enumDefinition
        |    fcnDeclarationVoidOrCtor
        |    fcnDeclaration 
        |    injectionDecl
        ;
    compositionDefinition
        :    'composition' IDENT
             extendsClause  
             implementsClause
             NL? braceOpenNL compositionFeatureList NL? braceCloseNL 
        ;
    compositionFeatureList
        :    compositionFeature*    
        ;
    compositionFeature
        :    stmtExport     
        |    'preset' typeName formalParameterList fcnBody
        |    fcnDefinitionVoidOrCtor
        |    fcnDefinition     
        |    enumDefinition
        |    varDeclaration
        |    injectionDecl
        ; 
    
    stmtImport
        :    'from' importFrom
        |    'import' qualName metaArguments?  importAs?  delim 
        ;
    importFrom
        :    qualName 'import' qualName metaArguments?  importAs? delim 
        ;
    importAs
        :    'as' qualName 
        ;
    importList
        :    stmtImport+
        ;
    meta 
        :    'meta' NL? braceOpenNL metaParmsGen NL? braceCloseNL 
        ;    
    metaParmsGen
        :    metaParmGen ( ',' NL?  metaParmGen )*
        ;
    metaParmGen 
        :    'type' IDENT (ASSIGN typeName)? 
        |    IDENT (ASSIGN primitiveLit)?
        ;
    metaArguments 
        :    BRACE_OP NL? BRACE_CL 
        |    BRACE_OP  metaArgumentList  BRACE_CL
        ; 
    metaArgumentList 
        :    metaFirstArg (metaArgument)* 
       ;
    metaFirstArg
        :    metaArg NL?
        |    //  Note empty rule selected when first argument not is present (default value used). 
        ;
    metaArgument   
        :    metaDelim metaArg 
        |    ',' NL? 
        ; 
    metaDelim
        :    ',' NL?
        ;
    metaArg
        :    primitiveLit
        |    typeNameScalar
        ;
    typeName
        :    typeNameScalar
        ;
    typeNameScalar            // Note scalar as in 'not array'
        :    builtinType    
        |    userTypeName
        ;
    userTypeName
        :    qualName    
        ;
    typeNameArray        
        :    builtinType   
        |    userTypeNameArr
        ;
    userTypeNameArr
        :    qualName    
        ;
    unitTypeDefinition
        :    meta?
         (      moduleDefinition           
           |    classDefinition
           |    protocolDefinition 
           |    compositionDefinition 
           |    enumDefinition 
         )
       ;
    extendsClause
        :    'extends' qualName
        |     
        ;
    implementsClause
        :    'implements' qualName 
        |     
        ;
    braceCloseNL
        :    BRACE_CL NL | BRACE_CL
        ;
    braceOpenNL
        :    BRACE_OP NL | BRACE_OP
        ;
    equalityOp
        :    EQ | NOT_EQ
        ;
    relationalOp
        :    LT | GT | LT_EQ  | GT_EQ
        ;
    shiftOp
        :    '<<' | '>>'
        ;
    incDecOp
        :    INC | DEC
        ;
    addSubOp
        :    PLUS | MINUS
        ;
    assignOp
        :    ADD_EQ  | SUB_EQ  | MUL_EQ  | DIV_EQ  | MOD_EQ  | LSHFT_EQ  | RSHFT_EQ | BITAND_EQ  | BITXOR_EQ  | BITOR_EQ
        ;
    multDivModOp
        :    '*' | '/' | '%'
        ;
    logicalNotOp    
        :    LOG_NOT
        ;
    bitwiseNotOp    
        :    BIT_NOT
        ;
    exprList 
        :    expr (',' expr)*    
        |
        ;
    expr
        :    exprLogicalOr exprQuestOp?
       ;
    exprQuestOp
        :    '?' expr ':' expr 
       ;
    exprLogicalOr 
        :    exprLogicalAnd ( '||' exprLogicalAnd )*
        ;
    exprLogicalAnd
        :    exprBitwiseOr ( '&&' exprBitwiseOr )*
        ;
    exprBitwiseOr
        :    exprBitwiseXor ( '|' exprBitwiseXor )*
        ;
    exprBitwiseXor
        :    exprBitwiseAnd ( '^' exprBitwiseAnd )*
        ;
    exprBitwiseAnd
        :    exprEquality ( '&' exprEquality )*
        ;
    exprEquality
        :    exprRelational ( equalityOp exprRelational )*
        ;
    exprRelational
        :    exprShift ( relationalOp exprShift )*
        ;
    exprShift
        :    exprAddSub ( shiftOp  exprAddSub )*
        ;
    exprAddSub
        :    exprMultDiv ( addSubOp exprMultDiv )*
        ;
    exprMultDiv
        :    exprUnary ( multDivModOp exprUnary )*
        ;
    exprNew
        :    'new' qualName fcnArgumentList fieldOrArrayAccess? 
        ;
    exprUnary
        :    injectionCode
        |    logicalNotOp exprPrimary  
        |    bitwiseNotOp exprPrimary   
        |    MINUS exprPrimary           
        |    incDecOp exprPrimary         
        |    exprPrimary incDecOp?
        ;
    exprPrimary
        :    primitiveLit
        |    '(' expr ')'             
        |    varOrFcnOrArray
        ;
    fcnDefinition
        :    fcnAttr fcnType_fcnName formalParameterList fcnBody
        ;
    fcnDefinitionVoidOrCtor
        // Either a constructor or a void function.
        :    fcnAttr fcnType formalParameterList fcnBody
        ;
    fcnAttr
        :    ( 'public' | 'host' )*
        ;
    fcnBody
        :    NL? braceOpenNL stmts  braceCloseNL  
        ;
    fcnDeclarationVoidOrCtor
        :    fcnAttr fcnType formalParameterList delim
       ;
    fcnType
        :    typeName   // constructor 
        |    qualName   // void fcn 
        ;
    fcnDeclaration
        :    fcnAttr fcnType_fcnName formalParameterList delim
       ;
    fcnType_fcnName
        :    typeNameArray varArraySpec qualName
        |    typeName qualName  
        ;
    formalParameterList
        :    '(' formalParameters ')' 
        ;
    formalParameters
        :    formalParameter (NL? ',' NL? formalParameter)*  
        |    
        ;
    formalParameter
        :    'type' IDENT (ASSIGN typeName)? // Note for meta (not function) arguments
        |    formalParameterArr
        |    typeName IDENT (ASSIGN expr)?
        ;
    formalParameterArr
        :    typeNameArray '[' ']' IDENT ( ASSIGN expr)?
        ;
    fcnArgumentList
        :    '(' fcnArguments ')'
        ;
    fcnArguments
        :    exprList
        ;
    varOrFcnOrArray
        :    '@' (IDENT fcnArgumentList? fieldOrArrayAccess?)?
        |    qualName fcnArgumentList  fieldOrArrayAccess?
        |    qualName arrayAccess fcnArgumentList? fieldOrArrayAccess?
        |    qualName 
        ;
    
    fieldOrArrayAccess
        :    ( fieldAccess | arrayAccess fcnArgumentList? )+
        ;
    fieldAccess
        :    '.' IDENT fcnArgumentList?
        ;
    arrayAccess
        :    '[' (exprList) ']'  
        ;
    stmtBlock
        :    braceOpenNL stmts braceCloseNL 
        ;
    stmts
        :    (stmt)+ 
        |     
        ;
    stmt
        :    stmtAssignInject
        |    stmtInjection
        |    stmtBlock
        |    stmtPrint
        |    stmtReturn
        |    stmtBreak
        |    stmtContinue
        |    stmtFor
        |    stmtSwitch 
        |    stmtDoWhile
        |    stmtIf
        |    stmtProvided
        |    stmtWhile 
        |    stmtDecl 
        |    stmtAssignVar
        |    stmtBind
        |    stmtPeg 
        |    varDeclarationNew
        |    exprUnary delim
        ;
    exprAssign
        :    exprChainedAssign
        |    exprNew
        |    expr
        ;
    exprChainedAssign
        :    exprUnary ASSIGN exprAssign 
        ;
        
    stmtAssignVar
        :    varOrFcnOrArray assign exprAssign delim
        ;
    stmtAssignInject
        :    injectionCode assign expr delim
        ;
    assign
        :    ASSIGN |    assignOp
        ;
    stmtBind
        :    qualName BIND userTypeName delim 
        ;
    stmtPeg
        :    varOrFcnOrArray PEG exprAssign delim 
        ;
    printItemList
        :    printItem ( PLUS printItem )*
        |    
        ;
    printItem
        :    primitiveLit    
        |    varOrFcnOrArray
        ;
    stmtPrint
        :    'print' stmtPrintTarget printItemList delim
        ;
    stmtPrintTarget
        :    'log'  
        |    'err' 
        |    'out'
        |    // Note default is 'out' 
        ;
    stmtReturn
        :    'return'  ( (expr  delim) |    delim )
        ;
    stmtBreak
        :    'break' delim
        ;
    stmtContinue
        :    'continue' delim 
        ;
    stmtFor
        // Note 'i' can be undeclared:    'for (i=0; i<10; i++)'
        // 'i' will be given the default type of uint32.
        :    'for' '(' stmtForInit stmtForCond stmtForNext ')' NL? stmtBlock
        ;
    stmtForCond
        :    expr? SEMI 
        ;
    stmtForInit
        :    SEMI
        |    typeName IDENT ASSIGN expr SEMI
        |    stmtAssignInject
        |    stmtAssignVar
        ;
    stmtForNext
        :    expr?
        ;
    stmtSwitch
        :    'switch' '(' expr ')' NL? braceOpenNL stmtsCase stmtDefault? braceCloseNL    
        ;
    stmtsCase
        :    stmtCase* 
        ;
    stmtDefault
        :    'default' ':' NL? stmts 
        ;
    stmtCase
        :    'case' (INT_LIT |    qualName)  ':' NL? stmts    
        ;
    stmtDoWhile
        :    'do' NL? stmtBlock 'while' '(' expr ')' delim
        ;
    stmtIf
        :    'if' stmtIfBlock stmtsElif stmtElse?
        ;
    stmtIfBlock
        :    '(' expr ')' NL? stmtBlock
        ;
    stmtsElif
        :    stmtElif* 
        ;
    stmtElif
        :    'elif' stmtIfBlock 
        ;
    stmtElse
        :    'else' NL?  
        ;
    stmtProvided
        :    'provided' '(' expr ')' NL? stmtBlock stmtElse?
        ;
    stmtWhile
        :    'while' '('expr')' stmtWhile2 
        ;
    stmtWhile2
        :    ';' NL   // Note empty is allowed
        |    NL? stmtBlock 
        ;
    stmtDecl
        :    varDeclaration
       ;
    fieldDeclaration    
        :    varDeclarationNew
        |    varAttr varDecl delim 
       ;
    varDeclaration   
        :    varAttr varDecl delim 
        ;
    varAttr
        :    ( 'const' |    'volatile' |    'host' )*
        ;
    varDecl
        :    varDeclList
        |    varArray 
        |    varArray2
        |    varFcnRef 
        |    varFcnRef2
        ;
    varDeclarationNew        //  Note these can't be in a varDeclList
        :    'host'? 'new' qualName IDENT fcnArgumentList  delim 
        ;
    varFcnRef
        :    '(' typeName fcnRefArgTypeList ')' IDENT (ASSIGN expr)?
        |    typeName fcnRefArgTypeList  IDENT (ASSIGN expr)? 
        ;
    varFcnRef2
        // Note distinguished by having a return type specified
        :    '(' rtnType typeName fcnRefArgTypeList ')' IDENT (ASSIGN expr)?
        ;            
    rtnType 
        :    typeName
        ;
    fcnRefArgTypeList
        :    '(' fcnRefArgTypes ')' 
        ;
    fcnRefArgTypes
        :    typeName (',' typeName)* 
        |    
        ;
    varArray
        :    typeNameArray IDENT varArraySpec varArrayInit
        ;    
    varArray2
        :    typeNameArray varArraySpec IDENT varArrayInit?
        ;    
    varArraySpec
        :    ('[' varDim ']')+    
        ;
    varArrayInit
        :    ASSIGN initializer | PEG initializer
        ;
    varDim
        :    expr  
        |    // Note the empty rule specifies an array without dimension 
        ;
    initializer   
        :    expr 
        |    exprNew
        |    braceOpenNL initializer_list braceNLClose  
        ;
    initializer_list
        :    initializer (',' NL? initializer )*  
        ;
    
    braceNLClose
        :    NL BRACE_CL
        |    BRACE_CL
        ;
    varDeclList  // Note example:    'int x, y=3, z=3, a'
        :    builtInType  varListBuiltInType
        |    userTypeName varListUserDefType
        ;    
    varListBuiltInType
        :    varInit2 ( ',' varInit2 )*     
        ;
    varInit2      // Note used for built in type
        :    IDENT ASSIGN?
        ;
    varListUserDefType
        :    varInit ( ',' varInit )*  
        ;
    varInit     // Note used for a user defined type
        :    IDENT BIND userTypeName 
        |    IDENT PEG expr 
        |    IDENT ASSIGN exprNew 
        |    IDENT ASSIGN expr
        |    IDENT 
        ;
    builtinType  
        :    'bool' 
        |    'byte'
        |    'int8' 
        |    'int16'
        |    'int32'
        |    'real' 
        |    'string'
        |    'uint8' 
        |    'uint16'
        |    'uint32'
        ;
        
    qualName 
        :    IDENT qualNameList? 
        ;
    
    qualNameList 
        :
        (   
            '.' IDENT 
        )+     
        ; 
    namedConstant
        :    qualName   
        ;
    boolLit
        :    ('true' | 'false') 
        ;
    nullLit
        :    'null' 
        ;
    numLit
        :    INT_LIT 
        |    OCT_LIT 
        |    REAL_LIT 
        |    HEX_LIT  
        ;
    primitiveLit 
        :    boolLit 
        |    numLit  
        |    nullLit 
        |    STRING 
        |    CHAR 
        ;
    stmtInjection
        :    inject NL    
        ;
    inject
        :    INJECT 
        ;
    injectionCode
        :    inject
        ;
    injectionDecl
        :    inject
        ;
    delim
        :    SEMI NL 
        |    SEMI 
        |    NL  
        ;
        
    // lexer rules
    IDENT
        :    I (I | D)*
        ;
    HEX_LIT
        :    ('0x' | '0X') (H)+ (LU)?
        ;
    OCT_LIT
        :    '0' O+
        ;
    REAL_LIT
        :    D+ E ('l' | 'L')?
        |    D+ '.' D* (E)? ('l' | 'L')?
        ;
    INT_LIT
        :    D+ (LU)? 
        ;    
    CHAR
        :    '\'' (('\\' ~'\n') | ~('\\' | '\'' | '\n')) '\''
        ;
    STRING
        :    '"'  (('\\' ~'\n') | ~('\\' | '"' | '\n'))* '"'
        |    '\'' (('\\' ~'\n') | ~('\\' | '\'' | '\n'))+ '\''
        ;
    WS
        :    (' ' | '\t')+ 
        ;
    SL_COMMENT               // single line comment
        :    '#' ~('\n'|'\r')*  
        |    '/''/' ~('\n'|'\r')*   
        |    SLCOM3 ~('\n'|'\r')+  
        ;
    INJECT
        :    IJ_BEG (.)* IJ_END
        ;
    ML_COMMENT                // multi line comment
        :    MULCOM (.)*  '--!' (NEWLINE)* 
        ;
    SEMI
        :    ';'
        ;
    BRACE_OP
        :    '{'
        ;
    BRACE_CL
        :    '}'   
        ;
    // Note multiple blank lines and comments are concatenated into a single NL. 
    NL   
        :    ( (NEWLINE) ( (WS)? NEWLINE)* ) WS?  (COM)*
        ;
    fragment COM:
             (
               ( SL_COMMENT | MULCOM (.)*  '--!' ) (WS)? NEWLINE ( (WS)? NEWLINE)* WS?
             )
     ;
    ILLEGAL_CHARACTER
        :    '\u0080'..'\uFFFF'
        ;
    // Fragments:    never returned to the parser as a token
    fragment I  :    ('a'..'z'|'A'..'Z'|'_'|'$') ;
    fragment D  :    '0'..'9' ;
    fragment O  :    '0'..'7';
    fragment H  :    'a'..'f' | 'A'..'F' | '0'..'9' ;
    fragment E  :    ('E' | 'e') (PLUS | MINUS)? (D)+ ;
    fragment LU :    'LU' | 'Lu' | 'lU' | 'lu' | 'UL' | 'uL' | 'Ul' | 'ul' | 'l' | 'u' | 'L' | 'U' ;
    fragment NEWLINE : '\r' '\n' | '\n' | '\r';
    fragment MULCOM  : '!--';
    fragment SLCOM1  : '/''/';
    fragment SLCOM2  : '#';
    fragment SLCOM3  : '---';
    INC         :    '++';
    PLUS        :    '+';
    DEC         :    ('--');
    MINUS       :    ('-');
    ASSIGN      :    '=';  
    BIND        :    ':=';
    ADD_EQ      :    '+=';
    SUB_EQ      :    '-=';
    MUL_EQ      :    '*=';
    DIV_EQ      :    '\\=';
    BITOR_EQ    :    '|=';
    BITXOR_EQ   :    '^=';
    BITAND_EQ   :    '&=';
    RSHFT_EQ    :    '>>=';
    LSHFT_EQ    :    '<<=';
    MOD_EQ      :    '%=';
    PEG         :    '@=';
    EQ          :    '==';
    NOT_EQ      :    '!=';
    LT_EQ       :    '<=';
    GT_EQ       :    '>=';
    LOG_NOT     :    '!';
    BIT_NOT     :    '~';
    GT          :    '>';
    LT          :    '<';
    // Injection blocks:
    IJ_BEG      :    '+{';
    IJ_END      :    '}+';
