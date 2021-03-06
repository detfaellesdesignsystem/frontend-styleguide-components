'use strict';
class CheckboxToggleContent{
    constructor(el){
        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-aria-controls';
        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);
        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
        this.targetEl = null;
        this.checkboxEl = null;

        this.init(el);
    }

    init(el){
        this.checkboxEl = el;
        var that = this;
        this.checkboxEl.addEventListener('change', function (event){
            that.toggle(that.checkboxEl);
        });
        this.toggle(this.checkboxEl);
    }

    toggle(triggerEl){
        var targetAttr = triggerEl.getAttribute(this.jsToggleTarget)
        var targetEl = document.getElementById(targetAttr);
        if(targetEl === null || targetEl === undefined){
            throw new Error(`Could not find panel element. Verify value of attribute `+ this.jsToggleTarget);
        }
        if(triggerEl.checked){
            this.open(triggerEl, targetEl);
        }else{
            this.close(triggerEl, targetEl);
        }
    }

    open(triggerEl, targetEl){
        if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
            triggerEl.setAttribute('data-aria-expanded', 'true');
            targetEl.classList.remove('collapsed');
            targetEl.setAttribute('aria-hidden', 'false');
            triggerEl.dispatchEvent(this.eventOpen);
        }
    }
    close(triggerEl, targetEl){
        if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
            triggerEl.setAttribute('data-aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
            triggerEl.dispatchEvent(this.eventClose);
        }
    }
}

module.exports = CheckboxToggleContent;
