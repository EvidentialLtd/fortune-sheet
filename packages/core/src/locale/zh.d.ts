declare const _default: {
    generalDialog: {
        partiallyError: string;
        readOnlyError: string;
        dataNullError: string;
        noSeletionError: string;
        cannotSelectMultiple: string;
    };
    functionlist: ({
        n: string;
        t: number;
        d: string;
        a: string;
        m: number[];
        p: {
            name: string;
            detail: string;
            example: string;
            require: string;
            repeat: string;
            type: string;
        }[];
    } | {
        n: string;
        t: number;
        d: string;
        a: string;
        p: {
            name: string;
            detail: string;
            example: string;
            require: string;
            repeat: string;
            type: string;
        }[];
        m?: undefined;
    } | {
        n: string;
        t: string;
        d: string;
        a: string;
        m: number[];
        p: {
            name: string;
            example: string;
            detail: string;
            require: string;
            repeat: string;
            type: string;
        }[];
    })[];
    toolbar: {
        toolbar: string;
        undo: string;
        redo: string;
        "clear-format": string;
        "format-painter": string;
        "currency-format": string;
        "percentage-format": string;
        "number-decrease": string;
        "number-increase": string;
        moreFormats: string;
        "border-all": string;
        "merge-all": string;
        format: string;
        font: string;
        "font-size": string;
        bold: string;
        italic: string;
        "strike-through": string;
        underline: string;
        "font-color": string;
        "align-left": string;
        "align-center": string;
        "align-right": string;
        "align-top": string;
        "align-mid": string;
        "align-bottom": string;
        chooseColor: string;
        resetColor: string;
        customColor: string;
        alternatingColors: string;
        confirmColor: string;
        cancelColor: string;
        collapse: string;
        background: string;
        border: string;
        borderStyle: string;
        "merge-cell": string;
        chooseMergeType: string;
        horizontalAlign: string;
        verticalAlign: string;
        alignment: string;
        textWrap: string;
        textWrapMode: string;
        textRotate: string;
        textRotateMode: string;
        freeze: string;
        sort: string;
        filter: string;
        sortAndFilter: string;
        findAndReplace: string;
        "formula-sum": string;
        autoSum: string;
        moreFunction: string;
        conditionalFormat: string;
        comment: string;
        pivotTable: string;
        chart: string;
        screenshot: string;
        splitColumn: string;
        insertImage: string;
        insertLink: string;
        dataVerification: string;
        protection: string;
        clearText: string;
        noColorSelectedText: string;
        toolMore: string;
        toolLess: string;
        toolClose: string;
        toolMoreTip: string;
        moreOptions: string;
        cellFormat: string;
        print: string;
    };
    alternatingColors: {
        applyRange: string;
        selectRange: string;
        header: string;
        footer: string;
        errorInfo: string;
        textTitle: string;
        custom: string;
        close: string;
        selectionTextColor: string;
        selectionCellColor: string;
        removeColor: string;
        colorShow: string;
        currentColor: string;
        tipSelectRange: string;
        errorNoRange: string;
        errorExistColors: string;
    };
    button: {
        confirm: string;
        cancel: string;
        close: string;
        update: string;
        delete: string;
        insert: string;
        prevPage: string;
        nextPage: string;
        total: string;
    };
    paint: {
        start: string;
        end: string;
        tipSelectRange: string;
        tipNotMulti: string;
    };
    format: {
        moreCurrency: string;
        moreDateTime: string;
        moreNumber: string;
        titleCurrency: string;
        decimalPlaces: string;
        titleDateTime: string;
        titleNumber: string;
        tipDecimalPlaces: string;
        select: string;
        format: string;
        currency: string;
    };
    info: {
        detailUpdate: string;
        detailSave: string;
        row: string;
        column: string;
        loading: string;
        copy: string;
        return: string;
        rename: string;
        tips: string;
        noName: string;
        wait: string;
        add: string;
        addLast: string;
        backTop: string;
        pageInfo: string;
        nextPage: string;
        tipInputNumber: string;
        tipInputNumberLimit: string;
        tipRowHeightLimit: string;
        tipColumnWidthLimit: string;
        pageInfoFull: string;
        sheetIsFocused: string;
        sheetNotFocused: string;
        sheetSrIntro: string;
        currentCellInput: string;
        newSheet: string;
        sheetOptions: string;
        Dropdown: string;
        zoomIn: string;
        zoomOut: string;
        toggleSheetFocusShortcut: string;
        selectRangeShortcut: string;
        autoFillDownShortcut: string;
        autoFillRightShortcut: string;
        boldTextShortcut: string;
        copyShortcut: string;
        pasteShortcut: string;
        undoShortcut: string;
        redoShortcut: string;
        deleteCellContentShortcut: string;
        confirmCellEditShortcut: string;
        moveRightShortcut: string;
        moveLeftShortcut: string;
        shortcuts: string;
    };
    currencyDetail: {
        name: string;
        pos: string;
        value: string;
    }[];
    numberFmtList: {
        name: string;
        pos: string;
        value: string;
    }[];
    defaultFmt: (currency: string) => ({
        text: string;
        value: string;
        example: string;
        icon?: undefined;
    } | {
        text: string;
        value: string;
        example: string;
        icon: string;
    })[];
    dateFmtList: {
        name: string;
        value: string;
    }[];
    fontFamily: {
        MicrosoftYaHei: string;
    };
    fontarray: string[];
    fontjson: {
        "times new roman": number;
        arial: number;
        tahoma: number;
        verdana: number;
        微软雅黑: number;
        "microsoft yahei": number;
        宋体: number;
        simsun: number;
        黑体: number;
        simhei: number;
        楷体: number;
        kaiti: number;
        仿宋: number;
        fangsong: number;
        新宋体: number;
        nsimsun: number;
        华文新魏: number;
        stxinwei: number;
        华文行楷: number;
        stxingkai: number;
        华文隶书: number;
        stliti: number;
    };
    border: {
        borderTop: string;
        borderBottom: string;
        borderLeft: string;
        borderRight: string;
        borderNone: string;
        borderAll: string;
        borderOutside: string;
        borderInside: string;
        borderHorizontal: string;
        borderVertical: string;
        borderColor: string;
        borderSize: string;
        borderSlash: string;
        borderDefault: string;
        borderStyle: string;
    };
    merge: {
        mergeAll: string;
        mergeV: string;
        mergeH: string;
        mergeCancel: string;
        overlappingError: string;
        partiallyError: string;
    };
    align: {
        left: string;
        center: string;
        right: string;
        top: string;
        middle: string;
        bottom: string;
    };
    textWrap: {
        overflow: string;
        wrap: string;
        clip: string;
    };
    rotation: {
        none: string;
        angleup: string;
        angledown: string;
        vertical: string;
        rotationUp: string;
        rotationDown: string;
    };
    freezen: {
        default: string;
        freezenRow: string;
        freezenColumn: string;
        freezenRC: string;
        freezenRowRange: string;
        freezenColumnRange: string;
        freezenRCRange: string;
        freezenCancel: string;
        noSeletionError: string;
        rangeRCOverErrorTitle: string;
        rangeRCOverError: string;
    };
    sort: {
        asc: string;
        desc: string;
        custom: string;
        hasTitle: string;
        sortBy: string;
        addOthers: string;
        close: string;
        confirm: string;
        columnOperation: string;
        secondaryTitle: string;
        sortTitle: string;
        sortRangeTitle: string;
        sortRangeTitleTo: string;
        noRangeError: string;
        mergeError: string;
    };
    filter: {
        filter: string;
        clearFilter: string;
        sortByAsc: string;
        sortByDesc: string;
        filterByColor: string;
        filterByCondition: string;
        filterByValues: string;
        filiterInputNone: string;
        filiterInputTip: string;
        filiterRangeStartTip: string;
        filiterRangeEndTip: string;
        filterValueByAllBtn: string;
        filterValueByClearBtn: string;
        filterValueByInverseBtn: string;
        filterValueByTip: string;
        filterConform: string;
        filterCancel: string;
        conditionNone: string;
        conditionCellIsNull: string;
        conditionCellNotNull: string;
        conditionCellTextContain: string;
        conditionCellTextNotContain: string;
        conditionCellTextStart: string;
        conditionCellTextEnd: string;
        conditionCellTextEqual: string;
        conditionCellDateEqual: string;
        conditionCellDateBefore: string;
        conditionCellDateAfter: string;
        conditionCellGreater: string;
        conditionCellGreaterEqual: string;
        conditionCellLess: string;
        conditionCellLessEqual: string;
        conditionCellEqual: string;
        conditionCellNotEqual: string;
        conditionCellBetween: string;
        conditionCellNotBetween: string;
        filiterMoreDataTip: string;
        filiterMonthText: string;
        filiterYearText: string;
        filiterByColorTip: string;
        filiterByTextColorTip: string;
        filterContainerOneColorTip: string;
        filterDateFormatTip: string;
        valueBlank: string;
        mergeError: string;
    };
    rightclick: {
        copy: string;
        copyAs: string;
        paste: string;
        insert: string;
        image: string;
        link: string;
        delete: string;
        deleteCell: string;
        deleteSelected: string;
        hide: string;
        hideSelected: string;
        showHide: string;
        to: string;
        left: string;
        right: string;
        top: string;
        bottom: string;
        moveLeft: string;
        moveUp: string;
        add: string;
        row: string;
        column: string;
        width: string;
        height: string;
        number: string;
        confirm: string;
        orderAZ: string;
        orderZA: string;
        clearContent: string;
        matrix: string;
        sortSelection: string;
        filterSelection: string;
        chartGeneration: string;
        firstLineTitle: string;
        untitled: string;
        array1: string;
        array2: string;
        array3: string;
        diagonal: string;
        antiDiagonal: string;
        diagonalOffset: string;
        offset: string;
        boolean: string;
        flip: string;
        upAndDown: string;
        leftAndRight: string;
        clockwise: string;
        counterclockwise: string;
        transpose: string;
        matrixCalculation: string;
        plus: string;
        minus: string;
        multiply: string;
        divided: string;
        power: string;
        root: string;
        log: string;
        delete0: string;
        removeDuplicate: string;
        byRow: string;
        byCol: string;
        generateNewMatrix: string;
        noMulti: string;
        cannotDeleteAllRow: string;
        cannotDeleteAllColumn: string;
        cannotDeleteRowReadOnly: string;
        cannotDeleteColumnReadOnly: string;
        cannotInsertOnRowReadOnly: string;
        cannotInsertOnColumnReadOnly: string;
        rowOverLimit: string;
        columnOverLimit: string;
    };
    comment: {
        insert: string;
        edit: string;
        delete: string;
        showOne: string;
        showAll: string;
    };
    screenshot: {
        screenshotTipNoSelection: string;
        screenshotTipTitle: string;
        screenshotTipHasMerge: string;
        screenshotTipHasMulti: string;
        screenshotTipSuccess: string;
        screenshotImageName: string;
        downLoadClose: string;
        downLoadCopy: string;
        downLoadBtn: string;
        browserNotTip: string;
        rightclickTip: string;
        successTip: string;
    };
    splitText: {
        splitDelimiters: string;
        splitOther: string;
        splitContinueSymbol: string;
        splitDataPreview: string;
        splitTextTitle: string;
        splitConfirmToExe: string;
        splitSymbols: {
            name: string;
            value: string;
        }[];
        tipNoMulti: string;
        tipNoMultiColumn: string;
        tipNoSelect: string;
    };
    imageText: {
        imageSetting: string;
        close: string;
        conventional: string;
        moveCell1: string;
        moveCell2: string;
        moveCell3: string;
        fixedPos: string;
        border: string;
        width: string;
        radius: string;
        style: string;
        solid: string;
        dashed: string;
        dotted: string;
        double: string;
        color: string;
    };
    punctuation: {
        tab: string;
        semicolon: string;
        comma: string;
        space: string;
    };
    findAndReplace: {
        find: string;
        replace: string;
        goto: string;
        location: string;
        formula: string;
        date: string;
        number: string;
        string: string;
        error: string;
        condition: string;
        rowSpan: string;
        columnSpan: string;
        locationExample: string;
        lessTwoRowTip: string;
        lessTwoColumnTip: string;
        findTextbox: string;
        replaceTextbox: string;
        regexTextbox: string;
        wholeTextbox: string;
        distinguishTextbox: string;
        allReplaceBtn: string;
        replaceBtn: string;
        allFindBtn: string;
        findBtn: string;
        noFindTip: string;
        modeTip: string;
        searchTargetSheet: string;
        searchTargetCell: string;
        searchTargetValue: string;
        searchInputTip: string;
        noReplceTip: string;
        noMatchTip: string;
        successTip: string;
        locationConstant: string;
        locationFormula: string;
        locationDate: string;
        locationDigital: string;
        locationString: string;
        locationBool: string;
        locationError: string;
        locationNull: string;
        locationCondition: string;
        locationRowSpan: string;
        locationColumnSpan: string;
        locationTiplessTwoRow: string;
        locationTiplessTwoColumn: string;
        locationTipNotFindCell: string;
    };
    sheetconfig: {
        delete: string;
        copy: string;
        rename: string;
        changeColor: string;
        hide: string;
        unhide: string;
        moveLeft: string;
        moveRight: string;
        resetColor: string;
        cancelText: string;
        chooseText: string;
        focus: string;
        tipNameRepeat: string;
        noMoreSheet: string;
        confirmDelete: string;
        redoDelete: string;
        noHide: string;
        chartEditNoOpt: string;
        sheetNameSpecCharError: string;
        sheetNamecannotIsEmptyError: string;
    };
    conditionformat: {
        conditionformat_greaterThan: string;
        conditionformat_greaterThan_title: string;
        conditionformat_lessThan: string;
        conditionformat_lessThan_title: string;
        conditionformat_between: string;
        conditionformat_between_title: string;
        conditionformat_equal: string;
        conditionformat_equal_title: string;
        conditionformat_textContains: string;
        conditionformat_textContains_title: string;
        conditionformat_occurrenceDate: string;
        conditionformat_occurrenceDate_title: string;
        conditionformat_duplicateValue: string;
        conditionformat_duplicateValue_title: string;
        conditionformat_top10: string;
        conditionformat_top10_percent: string;
        conditionformat_top10_title: string;
        conditionformat_last10: string;
        conditionformat_last10_percent: string;
        conditionformat_last10_title: string;
        conditionformat_aboveAverage: string;
        conditionformat_aboveAverage_title: string;
        conditionformat_belowAverage: string;
        conditionformat_belowAverage_title: string;
        rule: string;
        newRule: string;
        editRule: string;
        deleteRule: string;
        deleteCellRule: string;
        deleteSheetRule: string;
        manageRules: string;
        showRules: string;
        highlightCellRules: string;
        itemSelectionRules: string;
        conditionformatManageRules: string;
        format: string;
        setFormat: string;
        setAs: string;
        setAsByArea: string;
        applyRange: string;
        selectRange: string;
        selectRange_percent: string;
        selectRange_average: string;
        selectRange_value: string;
        pleaseSelectRange: string;
        selectDataRange: string;
        selectCell: string;
        pleaseSelectCell: string;
        pleaseSelectADate: string;
        pleaseEnterInteger: string;
        onlySingleCell: string;
        conditionValueCanOnly: string;
        ruleTypeItem1: string;
        ruleTypeItem2: string;
        ruleTypeItem2_title: string;
        ruleTypeItem3: string;
        ruleTypeItem3_title: string;
        ruleTypeItem4: string;
        ruleTypeItem4_title: string;
        ruleTypeItem5: string;
        ruleTypeItem6: string;
        formula: string;
        textColor: string;
        cellColor: string;
        confirm: string;
        confirmColor: string;
        cancel: string;
        close: string;
        clearColorSelect: string;
        sheet: string;
        currentSheet: string;
        dataBar: string;
        dataBarColor: string;
        gradientDataBar_1: string;
        gradientDataBar_2: string;
        gradientDataBar_3: string;
        gradientDataBar_4: string;
        gradientDataBar_5: string;
        gradientDataBar_6: string;
        solidColorDataBar_1: string;
        solidColorDataBar_2: string;
        solidColorDataBar_3: string;
        solidColorDataBar_4: string;
        solidColorDataBar_5: string;
        solidColorDataBar_6: string;
        colorGradation: string;
        colorGradation_1: string;
        colorGradation_2: string;
        colorGradation_3: string;
        colorGradation_4: string;
        colorGradation_5: string;
        colorGradation_6: string;
        colorGradation_7: string;
        colorGradation_8: string;
        colorGradation_9: string;
        colorGradation_10: string;
        colorGradation_11: string;
        colorGradation_12: string;
        icons: string;
        pleaseSelectIcon: string;
        cellValue: string;
        specificText: string;
        occurrenceDate: string;
        greaterThan: string;
        lessThan: string;
        between: string;
        equal: string;
        in: string;
        to: string;
        between2: string;
        contain: string;
        textContains: string;
        duplicateValue: string;
        uniqueValue: string;
        top: string;
        top10: string;
        top10_percent: string;
        last: string;
        last10: string;
        last10_percent: string;
        oneself: string;
        above: string;
        aboveAverage: string;
        below: string;
        belowAverage: string;
        all: string;
        yesterday: string;
        today: string;
        tomorrow: string;
        lastWeek: string;
        thisWeek: string;
        lastMonth: string;
        thisMonth: string;
        lastYear: string;
        thisYear: string;
        last7days: string;
        last30days: string;
        next7days: string;
        next30days: string;
        next60days: string;
        chooseRuleType: string;
        editRuleDescription: string;
        newFormatRule: string;
        editFormatRule: string;
        formatStyle: string;
        fillType: string;
        color: string;
        twocolor: string;
        tricolor: string;
        multicolor: string;
        grayColor: string;
        gradient: string;
        solid: string;
        maxValue: string;
        medianValue: string;
        minValue: string;
        direction: string;
        threeWayArrow: string;
        fourWayArrow: string;
        fiveWayArrow: string;
        threeTriangles: string;
        shape: string;
        threeColorTrafficLight: string;
        fourColorTrafficLight: string;
        threeSigns: string;
        greenRedBlackGradient: string;
        rimless: string;
        bordered: string;
        mark: string;
        threeSymbols: string;
        tricolorFlag: string;
        circled: string;
        noCircle: string;
        grade: string;
        grade4: string;
        grade5: string;
        threeStars: string;
        fiveQuadrantDiagram: string;
        fiveBoxes: string;
    };
    insertLink: {
        linkText: string;
        linkType: string;
        linkAddress: string;
        linkSheet: string;
        linkCell: string;
        linkTooltip: string;
        selectCellRange: string;
        cellRangePlaceholder: string;
        placeholder1: string;
        placeholder2: string;
        placeholder3: string;
        tooltipInfo1: string;
        invalidCellRangeTip: string;
        openLink: string;
        goTo: string;
    };
    linkTypeList: {
        text: string;
        value: string;
    }[];
    dataVerification: {
        cellRange: string;
        selectCellRange: string;
        selectCellRange2: string;
        verificationCondition: string;
        allowMultiSelect: string;
        dropdown: string;
        checkbox: string;
        number: string;
        number_integer: string;
        number_decimal: string;
        text_content: string;
        text_length: string;
        date: string;
        validity: string;
        placeholder1: string;
        placeholder2: string;
        placeholder3: string;
        placeholder4: string;
        placeholder5: string;
        selected: string;
        notSelected: string;
        between: string;
        notBetween: string;
        equal: string;
        notEqualTo: string;
        moreThanThe: string;
        lessThan: string;
        greaterOrEqualTo: string;
        lessThanOrEqualTo: string;
        include: string;
        exclude: string;
        earlierThan: string;
        noEarlierThan: string;
        laterThan: string;
        noLaterThan: string;
        identificationNumber: string;
        phoneNumber: string;
        remote: string;
        prohibitInput: string;
        hintShow: string;
        deleteVerification: string;
        tooltipInfo1: string;
        tooltipInfo2: string;
        tooltipInfo3: string;
        tooltipInfo4: string;
        tooltipInfo5: string;
        tooltipInfo6: string;
        tooltipInfo7: string;
        textlengthInteger: string;
    };
    formula: {
        sum: string;
        average: string;
        count: string;
        max: string;
        min: string;
        ifGenerate: string;
        find: string;
        tipNotBelongToIf: string;
        tipSelectCell: string;
        ifGenCompareValueTitle: string;
        ifGenSelectCellTitle: string;
        ifGenRangeTitle: string;
        ifGenRangeTo: string;
        ifGenRangeEvaluate: string;
        ifGenSelectRangeTitle: string;
        ifGenCutWay: string;
        ifGenCutSame: string;
        ifGenCutNpiece: string;
        ifGenCutCustom: string;
        ifGenCutConfirm: string;
        ifGenTipSelectCell: string;
        ifGenTipSelectCellPlace: string;
        ifGenTipSelectRange: string;
        ifGenTipSelectRangePlace: string;
        ifGenTipNotNullValue: string;
        ifGenTipLableTitile: string;
        ifGenTipRangeNotforNull: string;
        ifGenTipCutValueNotforNull: string;
        ifGenTipNotGenCondition: string;
    };
    formulaMore: {
        valueTitle: string;
        tipSelectDataRange: string;
        tipDataRangeTile: string;
        findFunctionTitle: string;
        tipInputFunctionName: string;
        Array: string;
        Database: string;
        Date: string;
        Engineering: string;
        Filter: string;
        Financial: string;
        luckysheet: string;
        other: string;
        Logical: string;
        Lookup: string;
        Math: string;
        Operator: string;
        Parser: string;
        Statistical: string;
        Text: string;
        dataMining: string;
        selectFunctionTitle: string;
        calculationResult: string;
        tipSuccessText: string;
        tipParamErrorText: string;
        helpClose: string;
        helpCollapse: string;
        helpExample: string;
        helpAbstract: string;
        execfunctionError: string;
        execfunctionSelfError: string;
        execfunctionSelfErrorResult: string;
        allowRepeatText: string;
        allowOptionText: string;
        selectCategory: string;
    };
    drag: {
        noMerge: string;
        affectPivot: string;
        noMulti: string;
        noPaste: string;
        noPartMerge: string;
        inputCorrect: string;
        notLessOne: string;
        offsetColumnLessZero: string;
        pasteMustKeybordAlert: string;
        pasteMustKeybordAlertHTMLTitle: string;
        pasteMustKeybordAlertHTML: string;
    };
    pivotTable: {
        title: string;
        closePannel: string;
        editRange: string;
        tipPivotFieldSelected: string;
        tipClearSelectedField: string;
        btnClearSelectedField: string;
        btnFilter: string;
        titleRow: string;
        titleColumn: string;
        titleValue: string;
        tipShowColumn: string;
        tipShowRow: string;
        titleSelectionDataRange: string;
        titleDataRange: string;
        valueSum: string;
        valueStatisticsSUM: string;
        valueStatisticsCOUNT: string;
        valueStatisticsCOUNTA: string;
        valueStatisticsCOUNTUNIQUE: string;
        valueStatisticsAVERAGE: string;
        valueStatisticsMAX: string;
        valueStatisticsMIN: string;
        valueStatisticsMEDIAN: string;
        valueStatisticsPRODUCT: string;
        valueStatisticsSTDEV: string;
        valueStatisticsSTDEVP: string;
        valueStatisticslet: string;
        valueStatisticsVARP: string;
        errorNotAllowEdit: string;
        errorNotAllowMulti: string;
        errorSelectRange: string;
        errorIsDamage: string;
        errorNotAllowPivotData: string;
        errorSelectionRange: string;
        errorIncreaseRange: string;
        titleAddColumn: string;
        titleMoveColumn: string;
        titleClearColumnFilter: string;
        titleFilterColumn: string;
        titleSort: string;
        titleNoSort: string;
        titleSortAsc: string;
        titleSortDesc: string;
        titleSortBy: string;
        titleShowSum: string;
        titleStasticTrue: string;
        titleStasticFalse: string;
    };
    dropCell: {
        copyCell: string;
        sequence: string;
        onlyFormat: string;
        noFormat: string;
        day: string;
        workDay: string;
        month: string;
        year: string;
        chineseNumber: string;
    };
    imageCtrl: {
        borderTile: string;
        borderCur: string;
    };
    protection: {
        protectiontTitle: string;
        enterPassword: string;
        enterHint: string;
        swichProtectionTip: string;
        authorityTitle: string;
        selectLockedCells: string;
        selectunLockedCells: string;
        formatCells: string;
        formatColumns: string;
        formatRows: string;
        insertColumns: string;
        insertRows: string;
        insertHyperlinks: string;
        deleteColumns: string;
        deleteRows: string;
        sort: string;
        filter: string;
        usePivotTablereports: string;
        editObjects: string;
        editScenarios: string;
        allowRangeTitle: string;
        allowRangeAdd: string;
        allowRangeAddTitle: string;
        allowRangeAddSqrf: string;
        selectCellRange: string;
        selectCellRangeHolder: string;
        allowRangeAddTitlePassword: string;
        allowRangeAddTitleHint: string;
        allowRangeAddTitleHintTitle: string;
        allowRangeAddtitleDefault: string;
        rangeItemDblclick: string;
        rangeItemHasPassword: string;
        rangeItemErrorTitleNull: string;
        rangeItemErrorRangeNull: string;
        rangeItemErrorRange: string;
        validationTitle: string;
        validationTips: string;
        validationInputHint: string;
        checkPasswordNullalert: string;
        checkPasswordWrongalert: string;
        checkPasswordSucceedalert: string;
        defaultRangeHintText: string;
        defaultSheetHintText: string;
    };
    cellFormat: {
        cellFormatTitle: string;
        protection: string;
        locked: string;
        hidden: string;
        protectionTips: string;
        tipsPart: string;
        tipsAll: string;
        selectionIsNullAlert: string;
        sheetDataIsNullAlert: string;
    };
    print: {
        normalBtn: string;
        layoutBtn: string;
        pageBtn: string;
        menuItemPrint: string;
        menuItemAreas: string;
        menuItemRows: string;
        menuItemColumns: string;
    };
    edit: {
        typing: string;
    };
    websocket: {
        success: string;
        refresh: string;
        wait: string;
        close: string;
        contact: string;
        support: string;
    };
};
export default _default;
