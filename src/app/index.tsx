import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const courseData = [
  { key: 'starter', label: 'Starter', icon: '🍽️' },
  { key: 'main', label: 'Main Course', icon: '🍖' },
  { key: 'dessert', label: 'Dessert', icon: '🍰' },
];

const dietaryTags = [
  { id: 'gf', label: 'Gluten-Free', icon: '🌾❌' },
  { id: 'veg', label: 'Vegetarian', icon: '🌱' },
  { id: 'nuts', label: 'Contains Nuts', icon: '🥜' },
  { id: 'dairy', label: 'Dairy-Free', icon: '🥛❌' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('addDish'); // 'menu' | 'orders' | 'addDish' | 'setup' | 'staff'
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('starter');
  const [price, setPrice] = useState('');
  const [activeItem, setActiveItem] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState<Record<string, boolean>>({});
  type MenuItem = {
    id: string;
    name: string;
    description: string;
    course: string;
    price: string;
    active: boolean;
    dietary: string[];
  };
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const toggleDietary = (id: string) => {
    setSelectedDietary(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddDish = () => {
    if (!dishName.trim()) {
      Alert.alert('Validation Error', 'A Dish Name is mandatory.');
      return;
    }

    const numericPrice = Number(price);
    if (!price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Validation Error', 'A valid numeric Price is required.');
      return;
    }

    const selectedCourse = courseData.find(c => c.key === course) ?? courseData[0];

    const newMenuItem = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course: selectedCourse.label,
      price: parseFloat(price).toFixed(2),
      active: activeItem,
      dietary: dietaryTags.filter(t => selectedDietary[t.id]).map(t => t.id),
    };

    setMenuItems(prev => [newMenuItem, ...prev]);
    Alert.alert('✅ Success', `"${newMenuItem.name}" successfully added to catalogue.`);

    // Reset Form
    setDishName('');
    setDescription('');
    setCourse('starter');
    setPrice('');
    setActiveItem(false);
    setSelectedDietary({});
    setActiveTab('menu'); // Automatically take user to Menu tab to see added dish!
  };

  const handleTabPress = (tabName: string, label: string) => {
    setActiveTab(tabName);
    if (tabName !== 'addDish' && tabName !== 'menu') {
      Alert.alert(label, `${label} section clicked. Currently in preview mode.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Global Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderRow}>
          <View style={styles.profileBox}>
            <Text style={styles.profileInitial}>C</Text>
          </View>
          <View>
            <Text style={styles.globalHeaderTitle}>Christoffel inc.</Text>
            <Text style={styles.globalHeaderSubtitle}>Menu Catalog</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Notifications', 'No new alerts at this time.')}>
          <Text style={styles.notificationBell}>🔔</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Sub Header */}
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => setActiveTab('menu')}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.flexOne}>
              <Text style={styles.subHeaderSubtitle}>Christoffel inc.</Text>
              <Text style={styles.subHeaderTitle}>
                {activeTab === 'menu' ? "Chef's Menu Catalogue" : activeTab === 'addDish' ? "Add New Dish" : `${activeTab.toUpperCase()} Section`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Search', 'Search filter activated.')}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: ADD DISH FORM */}
          {activeTab === 'addDish' && (
            <View style={styles.card}>
              <View style={styles.statusGPRow}>
                <View style={styles.liveServiceBadge}>
                  <Text style={styles.liveDot}>•</Text>
                  <Text style={styles.liveText}>SERVICE PREP</Text>
                </View>
                <View style={styles.gpBadge}>
                  <Text style={styles.gpValue}>{menuItems.length} Custom Dishes</Text>
                  <Text style={styles.gpTarget}>GP Target 72%</Text>
                </View>
              </View>

              <Text style={styles.sectionHeading}>Add Dish Details</Text>
              <Text style={styles.sectionHelper}>
                Enter dish specifications and pricing to expand your catalogue.
              </Text>

              <Text style={styles.label}>Dish Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Seared Wagyu Beef Ribeye"
                value={dishName}
                onChangeText={setDishName}
              />

              <Text style={styles.label}>Select Course *</Text>
              <View style={styles.courseRow}>
                {courseData.map((c) => (
                  <TouchableOpacity
                    key={c.key}
                    style={[styles.courseButton, course === c.key && styles.courseButtonActive]}
                    onPress={() => setCourse(c.key)}
                  >
                    <Text style={styles.courseIcon}>{c.icon}</Text>
                    <Text style={[styles.courseText, course === c.key && styles.courseTextActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Gross Menu Price (R) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 385.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Description & Technique</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe culinary preparations, seasonal ingredients, and plating details..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Dietary Classifications</Text>
              <View style={styles.dietaryContainer}>
                {dietaryTags.map(tag => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[styles.dietaryTag, selectedDietary[tag.id] && styles.dietaryTagActive]}
                    onPress={() => toggleDietary(tag.id)}
                  >
                    <Text style={styles.dietaryText}>
                      {selectedDietary[tag.id] ? `${tag.icon} ${tag.label}` : tag.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.btnPrimary} onPress={handleAddDish}>
                <Text style={styles.btnPrimaryText}>✓ Save Menu Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSecondary} onPress={() => { setDishName(''); setDescription(''); setPrice(''); Alert.alert('Reset', 'Form cleared.'); }}>
                <Text style={styles.btnSecondaryText}>Discard Changes</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 2: MENU CATALOGUE VIEW */}
          {activeTab === 'menu' && (
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>Current Menu Items</Text>
              <Text style={styles.sectionHelper}>
                Review current active items in Chef Christoffel's selection.
              </Text>

              {menuItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🍽️</Text>
                  <Text style={styles.emptyTitle}>Catalogue Empty</Text>
                  <Text style={styles.empty}>
                    Tap the '+' button below to add your first dish.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={menuItems}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.menuItemCard}>
                      <View style={styles.menuItemRow}>
                        <Text style={styles.menuItemTitle}>{item.name}</Text>
                        <Text style={styles.menuItemPrice}>R {item.price}</Text>
                      </View>
                      <Text style={styles.menuItemBadge}>{item.course}</Text>
                      {item.description ? <Text style={styles.menuItemDesc}>{item.description}</Text> : null}
                    </View>
                  )}
                />
              )}
            </View>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {activeTab !== 'addDish' && activeTab !== 'menu' && (
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>{activeTab.toUpperCase()} Dashboard</Text>
              <Text style={styles.sectionHelper}>
                This section is accessible and connected to your navigation bar.
              </Text>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setActiveTab('addDish')}>
                <Text style={styles.btnPrimaryText}>+ Go to Add Dish</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 2. Primary Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('menu', 'Menu Overview')}
        >
          <Text style={[styles.navIcon, activeTab === 'menu' && styles.activeNavIcon]}>🍽️</Text>
          <Text style={[styles.navText, activeTab === 'menu' && styles.activeNavText]}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('orders', 'Orders View')}
        >
          <Text style={[styles.navIcon, activeTab === 'orders' && styles.activeNavIcon]}>📝</Text>
          <Text style={[styles.navText, activeTab === 'orders' && styles.activeNavText]}>Orders</Text>
        </TouchableOpacity>

        <View style={styles.addBtnContainer}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setActiveTab('addDish')}
          >
            <Text style={styles.addBtnIcon}>+</Text>
          </TouchableOpacity>
          <Text style={[styles.addBtnText, activeTab === 'addDish' && styles.activeNavText]}>New Dish</Text>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('setup', 'Restaurant Setup')}
        >
          <Text style={[styles.navIcon, activeTab === 'setup' && styles.activeNavIcon]}>⚙️</Text>
          <Text style={[styles.navText, activeTab === 'setup' && styles.activeNavText]}>Setup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleTabPress('staff', 'Staff Management')}
        >
          <Text style={[styles.navIcon, activeTab === 'staff' && styles.activeNavIcon]}>👥</Text>
          <Text style={[styles.navText, activeTab === 'staff' && styles.activeNavText]}>Staff</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf6' },
  flexOne: { flex: 1 },
  scroll: { padding: 12, paddingBottom: 100 },

  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f1f1', zIndex: 10 },
  topHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  profileBox: { width: 32, height: 32, backgroundColor: '#1A1A1A', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  profileInitial: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
  globalHeaderTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  globalHeaderSubtitle: { fontSize: 11, color: '#616161', marginTop: -2 },
  notificationBell: { fontSize: 20 },

  subHeader: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  backArrow: { fontSize: 20, color: '#1A1A1A', paddingRight: 10 },
  subHeaderSubtitle: { fontSize: 11, color: '#616161', marginBottom: 2 },
  subHeaderTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  searchIcon: { fontSize: 20 },

  card: { backgroundColor: '#ffffff', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#f1f1f1' },

  statusGPRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  liveServiceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  liveDot: { color: '#E53935', fontSize: 16, fontWeight: '900', marginRight: 4 },
  liveText: { color: '#B71C1C', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  gpBadge: { alignItems: 'flex-end' },
  gpValue: { fontSize: 11, fontWeight: '600', color: '#1A1A1A' },
  gpTarget: { fontSize: 10, color: '#E53935', fontWeight: '700' },

  sectionHeading: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  sectionHelper: { fontSize: 12, color: '#757575', lineHeight: 18, marginBottom: 16 },

  label: { fontSize: 12, fontWeight: '700', color: '#424242', marginTop: 14, marginBottom: 8 },
  input: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f1f1', paddingVertical: 12, fontSize: 14, color: '#1A1A1A' },
  textArea: { borderBottomWidth: 0, marginTop: 4, lineHeight: 22 },

  courseRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  courseButton: { flex: 1, alignItems: 'center', padding: 14, backgroundColor: '#f5f5f5', borderRadius: 8 },
  courseButtonActive: { backgroundColor: '#1A1A1A' },
  courseIcon: { fontSize: 24, marginBottom: 6 },
  courseText: { fontSize: 12, color: '#424242', fontWeight: '600' },
  courseTextActive: { color: '#ffffff' },

  dietaryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  dietaryTag: { backgroundColor: '#f1f1f1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, borderWidth: 1, borderColor: '#f1f1f1' },
  dietaryTagActive: { borderColor: '#E53935', backgroundColor: '#FEF2F2' },
  dietaryText: { fontSize: 11, color: '#424242', fontWeight: '600' },

  btnPrimary: { backgroundColor: '#B71C1C', borderRadius: 6, paddingVertical: 14, alignItems: 'center', marginTop: 30, shadowColor: '#B71C1C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  btnPrimaryText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  btnSecondary: { backgroundColor: 'transparent', borderRadius: 6, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  btnSecondaryText: { color: '#B71C1C', fontSize: 13, fontWeight: '700' },

  emptyContainer: { padding: 30, alignItems: 'center', backgroundColor: '#fafaf9', borderRadius: 8 },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  empty: { color: '#757575', fontSize: 12, textAlign: 'center', marginTop: 4 },

  menuItemCard: { backgroundColor: '#fafaf9', padding: 12, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  menuItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuItemTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  menuItemPrice: { fontSize: 14, fontWeight: '700', color: '#B71C1C' },
  menuItemBadge: { fontSize: 10, fontWeight: '700', color: '#757575', marginTop: 2, textTransform: 'uppercase' },
  menuItemDesc: { fontSize: 12, color: '#616161', marginTop: 6 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f1f1f1', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10, paddingHorizontal: 8, zIndex: 10 },
  navItem: { alignItems: 'center', paddingHorizontal: 12 },
  navIcon: { fontSize: 18, marginBottom: 4, opacity: 0.6 },
  activeNavIcon: { opacity: 1 },
  navText: { fontSize: 10, color: '#616161', fontWeight: '600' },
  activeNavText: { color: '#B71C1C', fontWeight: '800' },
  addBtnContainer: { marginTop: -24, alignItems: 'center' },
  addBtn: { width: 44, height: 44, backgroundColor: '#B71C1C', borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: '#B71C1C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  addBtnIcon: { fontSize: 22, color: '#ffffff', fontWeight: '700' },
  addBtnText: { fontSize: 10, color: '#616161', fontWeight: '700', marginTop: 4 },
});