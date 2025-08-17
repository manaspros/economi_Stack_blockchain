Certainly! Here are the **public functions** in your economiccounter.clar contract that you can call using `contract-call?`:

---

### **Callable Public Functions**

#### 1. **Create a new counter**
```clarity
(contract-call? .economiccounter create-counter)
```
Creates a new counter for the caller.

---

#### 2. **Increment a counter**
```clarity
(contract-call? .economiccounter increment-counter <counter-id>)
```
Increments your counter by paying the required STX.

---

#### 3. **List a counter for sale**
```clarity
(contract-call? .economiccounter list-counter-for-sale <counter-id> <price>)
```
Lists your counter for sale at the specified price.

---

#### 4. **Unlist a counter from sale**
```clarity
(contract-call? .economiccounter unlist-counter <counter-id>)
```
Removes your counter from the marketplace.

---

#### 5. **Buy a counter**
```clarity
(contract-call? .economiccounter buy-counter <counter-id>)
```
Buys a counter that is listed for sale.

---

### **Read-Only Functions**  
(Use `contract-call?` for public functions; use `contract-call?` or `contract-call? .economiccounter get-counter ...` for read-only in some environments.)

#### 6. **Get counter details**
```clarity
(contract-call? .economiccounter get-counter <counter-id>)
```

#### 7. **Get all counters owned by a user**
```clarity
(contract-call? .economiccounter get-user-counters <user-principal>)
```

#### 8. **Calculate increment cost**
```clarity
(contract-call? .economiccounter calculate-increment-cost <current-value>)
```

#### 9. **Get next milestone**
```clarity
(contract-call? .economiccounter get-next-milestone <value>)
```

#### 10. **Check if milestone claimed**
```clarity
(contract-call? .economiccounter milestone-claimed? <counter-id> <milestone>)
```

#### 11. **Get contract balance**
```clarity
(contract-call? .economiccounter get-contract-balance)
```

---

**Tip:**  
- Use public functions for actions that change state (create, increment, buy, list, unlist).
- Use read-only functions to query contract state (get info, check costs, etc).

Let me know if you want example arguments or more details for any function!