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
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  const handleAddDish = () => {
    if (!dishName.trim()) {
      Alert.alert('Validation Error', 'Please enter a dish name.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return;
    }
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course: course,
      price: parseFloat(price).toFixed(2),
    };

    setMenuItems((prev) => [newItem, ...prev]);
    Alert.alert('Success', `"${newItem.dishName}" added successfully!`);
    setDishName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chef's Menu Manager</Text>
            <Text style={styles.headerSubtitle}>
              Easily manage and view your restaurant menu
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add New Menu Item</Text>

            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Pan-Seared Scallops"
              value={dishName}
              onChangeText={setDishName}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Served with cauliflower puree"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Course Category *</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={course} onValueChange={setCourse}>
                <Picker.Item label="Starter" value="Starter" />
                <Picker.Item label="Main Course" value="Main Course" />
                <Picker.Item label="Dessert" value="Dessert" />
              </Picker>
            </View>

            <Text style={styles.label}>Price (R) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 185.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.btn} onPress={handleAddDish}>
              <Text style={styles.btnText}>+ Add Menu Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Menu Items</Text>

            {menuItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>
                  No menu items have been added yet. Fill in the form above to add your first dish.
                </Text>
              </View>
            ) : (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.itemCard}>
                    <View style={styles.row}>
                      <Text style={styles.itemTitle}>{item.dishName}</Text>
                      <Text style={styles.itemPrice}>R {item.price}</Text>
                    </View>
                    <View style={styles.tagContainer}>
                      <Text style={styles.tag}>{item.course}</Text>
                    </View>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  </View>
                )}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  flexOne: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  header: {
    backgroundColor: '#0f172a',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, color: '#0f172a' },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 8, marginBottom: 6 },
  input: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: { height: 70, textAlignVertical: 'top' },
  pickerBox: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  btn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  btnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  empty: { color: '#64748b', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  itemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', flex: 1 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: '#059669' },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginVertical: 6,
  },
  tag: { fontSize: 11, fontWeight: '600', color: '#3730a3' },
  itemDesc: { fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 18 },
});