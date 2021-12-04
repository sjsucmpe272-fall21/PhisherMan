import enchant
from urllib.parse import urlparse
topurl = enchant.request_pwl_dict("topdomains.txt")

def spell_check(url):
    x = []
    dom = urlparse(url).netloc
    #Remove Sub-Domain
    remsub = '.'.join(t.split('.')[1:])
    # most important. end the sequence
    if topurl.check(dom):
        x = ['Verified Domain']
        return x
    elif topurl.check(remsub):
        x = ['Verified Domain']
        return x
    
    temp = topurl.suggest(dom)
    temp2 = topurl.suggest(remsub)
    
    if len(temp2) == 0:
        x = temp
    elif len(temp2) > 1:
        x = temp
    else:
        x = temp2
    return x