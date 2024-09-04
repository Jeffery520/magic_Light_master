<template>
<uni-shadow-root class="vant-weapp-cascader-index"><view v-if="showHeader" class="van-cascader__header">
  <slot name="title" v-if="useTitleSlot"></slot>
  <text class="van-cascader__title" v-else>{{ title }}</text>
  <van-icon v-if="closeable" :name="closeIcon" class="van-cascader__close-icon" @click.native="onClose"></van-icon>
</view>

<van-tabs :active="activeTab" custom-class="van-cascader__tabs" wrap-class="van-cascader__tabs-wrap" tab-class="van-cascader__tab" :color="activeColor" :border="false" :swipeable="swipeable" @click="onClickTab">
  <van-tab v-for="(tab,tabIndex) in (tabs)" :key="tab.tabIndex" :title="tab.selected ? tab.selected[textKey] : placeholder" style="width: 100%;" :title-style="(!tab.selected ? 'color: #969799;font-weight:normal;' : '')">
    
    

    <view class="van-cascader__options">
      <view v-for="(option,index) in (tab.options)" :key="option.index" :class="(option.className)+' '+(utils.optionClass(tab, valueKey, option))" :style="utils.optionStyle({ tab, valueKey, option, activeColor })" :data-option="option" :data-tab-index="tabIndex" @click="onSelect">
        <text>{{ option[textKey] }}</text>
        <van-icon v-if="utils.isSelected(tab, valueKey, option)" name="success" size="18"></van-icon>
      </view>
    </view>
    
    
  </van-tab>
</van-tabs></uni-shadow-root>
</template>
<wxs src="./index.wxs" module="utils"></wxs>
<script>
import VanIcon from '../icon/index.vue'
import VanTab from '../tab/index.vue'
import VanTabs from '../tabs/index.vue'
global['__wxVueOptions'] = {components:{'van-icon': VanIcon,'van-tab': VanTab,'van-tabs': VanTabs}}

global['__wxRoute'] = 'vant-weapp/cascader/index'
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var FieldName;
(function (FieldName) {
    FieldName["TEXT"] = "text";
    FieldName["VALUE"] = "value";
    FieldName["CHILDREN"] = "children";
})(FieldName || (FieldName = {}));
var defaultFieldNames = {
    text: FieldName.TEXT,
    value: FieldName.VALUE,
    children: FieldName.CHILDREN,
};
(0, component_1.VantComponent)({
    props: {
        title: String,
        value: {
            type: String,
        },
        placeholder: {
            type: String,
            value: '请选择',
        },
        activeColor: {
            type: String,
            value: '#1989fa',
        },
        options: {
            type: Array,
            value: [],
        },
        swipeable: {
            type: Boolean,
            value: false,
        },
        closeable: {
            type: Boolean,
            value: true,
        },
        showHeader: {
            type: Boolean,
            value: true,
        },
        closeIcon: {
            type: String,
            value: 'cross',
        },
        fieldNames: {
            type: Object,
            value: defaultFieldNames,
            observer: 'updateFieldNames',
        },
        useTitleSlot: Boolean,
    },
    data: {
        tabs: [],
        activeTab: 0,
        textKey: FieldName.TEXT,
        valueKey: FieldName.VALUE,
        childrenKey: FieldName.CHILDREN,
        innerValue: '',
    },
    watch: {
        options: function () {
            this.updateTabs();
        },
        value: function (newVal) {
            this.updateValue(newVal);
        },
    },
    created: function () {
        this.updateTabs();
    },
    methods: {
        updateValue: function (val) {
            var _this = this;
            if (val !== undefined) {
                var values = this.data.tabs.map(function (tab) { return tab.selected && tab.selected[_this.data.valueKey]; });
                if (values.indexOf(val) > -1) {
                    return;
                }
            }
            this.innerValue = val;
            this.updateTabs();
        },
        updateFieldNames: function () {
            var _a = this.data.fieldNames || defaultFieldNames, _b = _a.text, text = _b === void 0 ? 'text' : _b, _c = _a.value, value = _c === void 0 ? 'value' : _c, _d = _a.children, children = _d === void 0 ? 'children' : _d;
            this.setData({
                textKey: text,
                valueKey: value,
                childrenKey: children,
            });
        },
        getSelectedOptionsByValue: function (options, value) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option[this.data.valueKey] === value) {
                    return [option];
                }
                if (option[this.data.childrenKey]) {
                    var selectedOptions = this.getSelectedOptionsByValue(option[this.data.childrenKey], value);
                    if (selectedOptions) {
                        return __spreadArray([option], selectedOptions, true);
                    }
                }
            }
        },
        updateTabs: function () {
            var _this = this;
            var options = this.data.options;
            var innerValue = this.innerValue;
            if (!options.length) {
                return;
            }
            if (innerValue !== undefined) {
                var selectedOptions = this.getSelectedOptionsByValue(options, innerValue);
                if (selectedOptions) {
                    var optionsCursor_1 = options;
                    var tabs_1 = selectedOptions.map(function (option) {
                        var tab = {
                            options: optionsCursor_1,
                            selected: option,
                        };
                        var next = optionsCursor_1.find(function (item) { return item[_this.data.valueKey] === option[_this.data.valueKey]; });
                        if (next) {
                            optionsCursor_1 = next[_this.data.childrenKey];
                        }
                        return tab;
                    });
                    if (optionsCursor_1) {
                        tabs_1.push({
                            options: optionsCursor_1,
                            selected: null,
                        });
                    }
                    this.setData({
                        tabs: tabs_1,
                    });
                    wx.nextTick(function () {
                        _this.setData({
                            activeTab: tabs_1.length - 1,
                        });
                    });
                    return;
                }
            }
            this.setData({
                tabs: [
                    {
                        options: options,
                        selected: null,
                    },
                ],
            });
        },
        onClose: function () {
            this.$emit('close');
        },
        onClickTab: function (e) {
            var _a = e.detail, tabIndex = _a.index, title = _a.title;
            this.$emit('click-tab', { title: title, tabIndex: tabIndex });
            this.setData({
                activeTab: tabIndex,
            });
        },
        // 选中
        onSelect: function (e) {
            var _this = this;
            var _a = e.currentTarget.dataset, option = _a.option, tabIndex = _a.tabIndex;
            if (option && option.disabled) {
                return;
            }
            var _b = this.data, valueKey = _b.valueKey, childrenKey = _b.childrenKey;
            var tabs = this.data.tabs;
            tabs[tabIndex].selected = option;
            if (tabs.length > tabIndex + 1) {
                tabs = tabs.slice(0, tabIndex + 1);
            }
            if (option[childrenKey]) {
                var nextTab = {
                    options: option[childrenKey],
                    selected: null,
                };
                if (tabs[tabIndex + 1]) {
                    tabs[tabIndex + 1] = nextTab;
                }
                else {
                    tabs.push(nextTab);
                }
                wx.nextTick(function () {
                    _this.setData({
                        activeTab: tabIndex + 1,
                    });
                });
            }
            this.setData({
                tabs: tabs,
            });
            var selectedOptions = tabs.map(function (tab) { return tab.selected; }).filter(Boolean);
            var value = option[valueKey];
            var params = {
                value: value,
                tabIndex: tabIndex,
                selectedOptions: selectedOptions,
            };
            this.innerValue = value;
            this.$emit('change', params);
            if (!option[childrenKey]) {
                this.$emit('finish', params);
            }
        },
    },
});
export default global['__wxComponents']['vant-weapp/cascader/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-cascader__header{align-items:center;display:flex;height:48px;justify-content:space-between;padding:0 16px}.van-cascader__title{font-size:16px;font-weight:600;line-height:20px}.van-cascader__close-icon{color:#c8c9cc;font-size:22px;height:22px}.van-cascader__tabs-wrap{height:48px!important;padding:0 8px}.van-cascader__tab{color:#323233!important;flex:none!important;font-weight:600!important;padding:0 8px!important}.van-cascader__tab--unselected{color:#969799!important;font-weight:400!important}.van-cascader__option{align-items:center;cursor:pointer;display:flex;font-size:14px;justify-content:space-between;line-height:20px;padding:10px 16px}.van-cascader__option:active{background-color:#f2f3f5}.van-cascader__option--selected{color:#1989fa;font-weight:600}.van-cascader__option--disabled{color:#c8c9cc;cursor:not-allowed}.van-cascader__option--disabled:active{background-color:initial}.van-cascader__options{-webkit-overflow-scrolling:touch;box-sizing:border-box;height:384px;overflow-y:auto;padding-top:6px}
</style>